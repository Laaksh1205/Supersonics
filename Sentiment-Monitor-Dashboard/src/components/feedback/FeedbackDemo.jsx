import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Divider, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Rating,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import FeedbackForm from './FeedbackForm';
import { submitFeedback, getAllFeedback, checkServerHealth } from '../../services/api';

// Helper function to get emotion icon
const getEmotionIcon = (emotion) => {
  switch(emotion) {
    case 'happy':
    case '😀':
      return <SentimentSatisfiedAltIcon color="success" />;
    case 'neutral':
    case '😐':
      return <SentimentNeutralIcon color="warning" />;
    case 'unhappy':
    case '😡':
      return <SentimentVeryDissatisfiedIcon color="error" />;
    default:
      return null;
  }
};

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const FeedbackDemo = () => {
  // State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // Check server health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkServerHealth();
        setServerStatus('online');
        loadFeedback();
      } catch (error) {
        setServerStatus('offline');
        setErrorMessage('API server is offline. Using local storage only.');
        setShowError(true);
      }
    };
    
    checkHealth();
  }, []);

  // Load feedback from API
  const loadFeedback = async () => {
    if (serverStatus !== 'online') return;
    
    setLoading(true);
    try {
      const data = await getAllFeedback();
      setFeedbackHistory(data);
    } catch (error) {
      setErrorMessage('Failed to load feedback history.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFeedbackSubmit = async (data) => {
    // If server is offline, store in local state only
    if (serverStatus !== 'online') {
      const mockFeedback = {
        ...data,
        id: `local-${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      setFeedbackHistory(prevHistory => [mockFeedback, ...prevHistory]);
      return Promise.resolve(mockFeedback);
    }
    
    // Otherwise send to API
    try {
      const response = await submitFeedback(data);
      
      // Add the new feedback to the history state
      setFeedbackHistory(prevHistory => [response.feedback, ...prevHistory]);
      
      // Return the response to the form component
      return response;
    } catch (error) {
      setErrorMessage('Failed to submit feedback. Please try again.');
      setShowError(true);
      throw error;
    }
  };

  // Toggle between form and feedback history
  const toggleView = () => {
    setShowForm(!showForm);
  };

  // Handle error message close
  const handleErrorClose = () => {
    setShowError(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom color="primary">
        Event Feedback System
      </Typography>
      
      {/* Server status indicator */}
      {serverStatus === 'checking' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Checking server status...</Typography>
        </Box>
      ) : serverStatus === 'offline' ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          API server is offline. Running in local mode.
        </Alert>
      ) : null}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={toggleView}
        >
          {showForm ? 'View Feedback History' : 'Back to Form'}
        </Button>
        
        {!showForm && (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={loadFeedback}
            disabled={loading || serverStatus !== 'online'}
          >
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Refresh Data
          </Button>
        )}
      </Box>
      
      {showForm ? (
        // Render feedback form
        <FeedbackForm 
          onSubmit={handleFeedbackSubmit} 
          eventId="tech-conference-2023"
        />
      ) : (
        // Render feedback history
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Feedback History
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : feedbackHistory.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No feedback submitted yet
            </Typography>
          ) : (
            <List>
              {feedbackHistory.map((feedback, index) => (
                <React.Fragment key={feedback.id || feedback.timestamp}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={feedback.rating} readOnly />
                          <Chip 
                            icon={getEmotionIcon(feedback.emotion)} 
                            label={feedback.emotion} 
                            size="small"
                            sx={{ ml: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {formatTimestamp(feedback.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {feedback.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < feedbackHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}
      
      {/* Instructions for integration */}
      <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" gutterBottom>
          Integration Instructions:
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Start the API server: <code>cd server && npm install && npm start</code></li>
            <li>Import the FeedbackForm component and API service</li>
            <li>Use submitFeedback from api.js to send feedback to server</li>
          </ol>
          <Box component="pre" sx={{ 
            bgcolor: '#eeeeee', 
            p: 1, 
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            {`import FeedbackForm from './components/feedback/FeedbackForm';
import { submitFeedback } from './services/api';

// In your component
const handleSubmit = async (data) => {
  try {
    const response = await submitFeedback(data);
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};

// In your render
<FeedbackForm 
  onSubmit={handleSubmit}
  eventId="your-event-id"
/>`}
          </Box>
        </Typography>
      </Paper>
      
      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FeedbackDemo; 