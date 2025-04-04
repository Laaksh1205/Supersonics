import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Rating,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

// Emotion option component
const EmotionOption = ({ value, selected, icon, label }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: selected ? 1 : 0.6,
      transform: selected ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.2s ease',
    }}
  >
    {icon}
    <Typography variant="caption" sx={{ mt: 0.5 }}>
      {label}
    </Typography>
  </Box>
);

const FeedbackForm = ({ onSubmit, eventId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      rating: 0,
      emotion: '',
      comment: ''
    }
  });

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Add event ID to the feedback data
      const feedbackData = {
        ...data,
        eventId,
        timestamp: new Date().toISOString()
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSubmit prop with feedback data
      await onSubmit(feedbackData);
      
      // Reset form after successful submission
      reset();
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Share Your Feedback
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Your feedback helps us improve the event experience. All responses are anonymous.
        </Typography>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            {/* Star Rating */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.rating}>
                <Typography component="legend" sx={{ mb: 1 }}>
                  How would you rate your experience?
                </Typography>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: 'Please select a rating' }}
                  render={({ field }) => (
                    <Rating
                      {...field}
                      size="large"
                      precision={1}
                      onChange={(_, value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.rating && (
                  <FormHelperText error>{errors.rating.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Emotion Selector */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.emotion}>
                <Typography component="legend" sx={{ mb: 1 }}>
                  How are you feeling about the event?
                </Typography>
                <Controller
                  name="emotion"
                  control={control}
                  rules={{ required: 'Please select an emotion' }}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      exclusive
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                      aria-label="emotion selection"
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        '& .MuiToggleButton-root': {
                          border: 'none',
                          borderRadius: '50%',
                          p: 1,
                          m: 1
                        }
                      }}
                    >
                      <ToggleButton value="happy" aria-label="happy">
                        <EmotionOption 
                          value="happy"
                          selected={field.value === 'happy'}
                          icon={<SentimentSatisfiedAltIcon color="success" sx={{ fontSize: 40 }} />}
                          label="Happy"
                        />
                      </ToggleButton>
                      <ToggleButton value="neutral" aria-label="neutral">
                        <EmotionOption 
                          value="neutral"
                          selected={field.value === 'neutral'}
                          icon={<SentimentNeutralIcon color="warning" sx={{ fontSize: 40 }} />}
                          label="Neutral"
                        />
                      </ToggleButton>
                      <ToggleButton value="unhappy" aria-label="unhappy">
                        <EmotionOption 
                          value="unhappy"
                          selected={field.value === 'unhappy'}
                          icon={<SentimentVeryDissatisfiedIcon color="error" sx={{ fontSize: 40 }} />}
                          label="Unhappy"
                        />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                {errors.emotion && (
                  <FormHelperText error>{errors.emotion.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Comment Text Area */}
            <Grid item xs={12}>
              <Controller
                name="comment"
                control={control}
                rules={{ 
                  required: 'Please share your thoughts',
                  maxLength: {
                    value: 500,
                    message: 'Comments cannot exceed 500 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Share your thoughts"
                    placeholder="What did you like? What could be improved?"
                    variant="outlined"
                    error={!!errors.comment}
                    helperText={
                      errors.comment ? 
                      errors.comment.message : 
                      `${field.value.length}/500 characters`
                    }
                    InputProps={{
                      inputProps: {
                        maxLength: 500
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                {isSubmitting && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Grid>
            
            {/* Success Message */}
            {submitSuccess && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'success.light', 
                    borderRadius: 1,
                    color: 'success.contrastText',
                    textAlign: 'center'
                  }}
                >
                  <Typography>
                    Thank you for your feedback!
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FeedbackForm; 