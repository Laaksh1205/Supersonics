/**
 * API service for interacting with the sentiment monitor server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Submit feedback to the server
 * @param {Object} feedbackData - The feedback data
 * @param {string} feedbackData.comment - User's comment (1-500 chars)
 * @param {number} feedbackData.rating - Rating from 1-5
 * @param {string} feedbackData.emotion - Emotion ('happy', 'neutral', 'unhappy')
 * @param {string} [feedbackData.eventId] - Optional event identifier
 * @returns {Promise<Object>} The server response
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get sentiment analytics from the server
 * @returns {Promise<Object>} The analytics data
 */
export const getSentimentAnalytics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`);

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get all feedback entries
 * @returns {Promise<Array>} Array of feedback entries
 */
export const getAllFeedback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

/**
 * Check server health
 * @returns {Promise<Object>} The health status
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error('Server health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Server health check failed:', error);
    throw error;
  }
};

export default {
  submitFeedback,
  getSentimentAnalytics,
  getAllFeedback,
  checkServerHealth,
}; 