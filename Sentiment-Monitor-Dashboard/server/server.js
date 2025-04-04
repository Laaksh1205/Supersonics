const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

// Database
const db = require('./db');
const FeedbackModel = require('./models/feedback');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(bodyParser.json());
app.use(morgan('dev')); // Logging

// Validation rules for feedback submission
const feedbackValidationRules = [
  check('comment')
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  check('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  check('emotion')
    .isIn(['happy', 'neutral', 'unhappy', '😀', '😐', '😡']) // Allow both text and emoji formats
    .withMessage('Emotion must be happy, neutral, or unhappy')
];

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// GET feedback analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await FeedbackModel.getAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      details: error.message 
    });
  }
});

// GET all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await FeedbackModel.getAllFeedback();
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      error: 'Failed to fetch feedback data',
      details: error.message 
    });
  }
});

// GET single feedback by ID
app.get('/api/feedback/:id', async (req, res) => {
  try {
    const feedback = await FeedbackModel.getFeedbackById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error(`Error fetching feedback with ID ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch feedback',
      details: error.message 
    });
  }
});

// POST new feedback
app.post('/api/feedback', feedbackValidationRules, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Extract data from request
    const { comment, rating, emotion, timestamp, eventId } = req.body;
    
    // Create feedback object
    const feedbackData = {
      comment,
      rating,
      emotion,
      timestamp: timestamp || new Date().toISOString(),
      event_id: eventId || 'default-event'
    };
    
    // Save to database
    const feedback = await FeedbackModel.createFeedback(feedbackData);
    
    // Log feedback for debugging
    console.log('Received and stored feedback:', feedback);
    
    // Return success response
    res.status(201).json({
      message: 'Feedback received successfully',
      feedback
    });
  } catch (error) {
    console.error('Error storing feedback:', error);
    res.status(500).json({ 
      error: 'Failed to store feedback',
      details: error.message 
    });
  }
});

// Initialize the database and start the server
const startServer = async () => {
  try {
    // Initialize database
    await db.initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 