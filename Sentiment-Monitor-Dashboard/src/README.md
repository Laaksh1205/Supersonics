# Event Feedback Component

A React-based feedback collection component for event applications using Material-UI and react-hook-form.

## Features

- **Polished Design**: Clean, responsive UI built with Material-UI
- **5-Star Rating System**: Intuitive star-based rating input
- **Emotion Selection**: Visual emotion indicators (Happy, Neutral, Unhappy)
- **Comment Form**: Text area with character count and 500 character limit
- **Form Validation**: Required field validation with helpful error messages
- **Loading State**: Visual loading indicator during submission
- **Success Feedback**: Confirmation message after successful submission

## Installation

```bash
npm install
npm start
```

## Usage

The feedback component can be integrated into any React application that uses Material-UI:

```jsx
import FeedbackForm from './components/feedback/FeedbackForm';

// In your component
const handleSubmit = async (data) => {
  // Process the feedback data (send to API, etc.)
  console.log('Feedback received:', data);
  
  // Return a promise for the form to handle loading state
  return Promise.resolve(data);
};

// In your render method
<FeedbackForm 
  onSubmit={handleSubmit}
  eventId="your-event-id" // Optional identifier
/>
```

## Feedback Data Structure

The component returns feedback in the following format:

```json
{
  "rating": 4,
  "emotion": "happy",
  "comment": "I really enjoyed the keynote session!",
  "eventId": "tech-conference-2023",
  "timestamp": "2023-10-15T14:30:45.123Z"
}
```

## Integration with Dashboard

This feedback component is designed to integrate with the Event Sentiment Monitor Dashboard. Steps to integrate:

1. Add the feedback form to your existing event application
2. Configure the form submission to send data to your sentiment analysis backend
3. Process and analyze the feedback in real-time
4. Display results on the dashboard with updated sentiment scores

## Customization

The component can be customized by:

- Modifying the theme in `index.js` to match your brand colors
- Adding additional form fields as needed
- Changing validation rules in the react-hook-form configuration
- Extending the emotion options with additional choices

## Dependencies

- React 18.x
- Material-UI 5.x
- react-hook-form 7.x 