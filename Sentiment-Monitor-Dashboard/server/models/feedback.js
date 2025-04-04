const db = require('../db');

// Helper function to categorize sentiment based on rating and emotion
function categorizeSentiment(rating, emotion) {
  // Normalize emoji to text format
  const normalizedEmotion = 
    emotion === '😀' ? 'happy' : 
    emotion === '😐' ? 'neutral' : 
    emotion === '😡' ? 'unhappy' : 
    emotion;
  
  // Determine sentiment category
  if (rating >= 4 || normalizedEmotion === 'happy') {
    return 'positive';
  } else if (rating <= 2 || normalizedEmotion === 'unhappy') {
    return 'negative';
  } else {
    return 'neutral';
  }
}

// Get all feedback entries
async function getAllFeedback() {
  try {
    const result = await db.query(
      'SELECT * FROM feedback ORDER BY timestamp DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting all feedback:', error);
    throw error;
  }
}

// Get feedback by ID
async function getFeedbackById(id) {
  try {
    const result = await db.query(
      'SELECT * FROM feedback WHERE id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error getting feedback with ID ${id}:`, error);
    throw error;
  }
}

// Create a new feedback entry
async function createFeedback(feedbackData) {
  const { comment, rating, emotion, event_id = 'default-event', timestamp = new Date() } = feedbackData;
  
  // Determine sentiment
  const sentiment = categorizeSentiment(rating, emotion);
  
  try {
    const result = await db.query(
      `INSERT INTO feedback (comment, rating, emotion, sentiment, event_id, timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [comment, rating, emotion, sentiment, event_id, timestamp]
    );
    
    // Update analytics after adding new feedback
    await updateAnalytics();
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
}

// Update analytics based on all feedback
async function updateAnalytics() {
  try {
    // Get counts of each sentiment category
    const sentimentCounts = await db.query(`
      SELECT 
        sentiment, 
        COUNT(*) as count 
      FROM feedback 
      GROUP BY sentiment
    `);
    
    // Calculate totals
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let total = 0;
    
    sentimentCounts.rows.forEach(row => {
      total += parseInt(row.count);
      if (row.sentiment === 'positive') {
        positive = parseInt(row.count);
      } else if (row.sentiment === 'neutral') {
        neutral = parseInt(row.count);
      } else if (row.sentiment === 'negative') {
        negative = parseInt(row.count);
      }
    });
    
    // Calculate percentages (with defaults if no feedback)
    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 65;
    const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 25;
    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 10;
    
    // Update the analytics table
    await db.query(`
      UPDATE analytics 
      SET 
        positive = $1, 
        neutral = $2, 
        negative = $3, 
        total = $4,
        last_updated = NOW()
      WHERE id = 1
    `, [positivePercent, neutralPercent, negativePercent, total]);
    
  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
}

// Get current analytics
async function getAnalytics() {
  try {
    const result = await db.query('SELECT * FROM analytics WHERE id = 1');
    
    // Add emotion breakdown
    const emotionBreakdown = await db.query(`
      SELECT 
        CASE 
          WHEN emotion IN ('😀', 'happy') THEN 'happy'
          WHEN emotion IN ('😐', 'neutral') THEN 'neutral'
          WHEN emotion IN ('😡', 'unhappy') THEN 'unhappy'
          ELSE emotion
        END as emotion_category,
        COUNT(*) as count
      FROM feedback 
      GROUP BY emotion_category
    `);
    
    // Format the emotion breakdown
    const emotions = { happy: 0, neutral: 0, unhappy: 0 };
    emotionBreakdown.rows.forEach(row => {
      emotions[row.emotion_category] = parseInt(row.count);
    });
    
    // Calculate average rating
    const ratingResult = await db.query('SELECT AVG(rating) as avg_rating FROM feedback');
    const averageRating = ratingResult.rows[0].avg_rating 
      ? parseFloat(ratingResult.rows[0].avg_rating).toFixed(1) 
      : 0;
    
    // Return formatted analytics
    return {
      positive: result.rows[0].positive,
      neutral: result.rows[0].neutral,
      negative: result.rows[0].negative,
      total: result.rows[0].total,
      averageRating: parseFloat(averageRating),
      emotionBreakdown: emotions,
      lastUpdated: result.rows[0].last_updated
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateAnalytics,
  getAnalytics,
  categorizeSentiment
}; 