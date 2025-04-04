# Event Sentiment API Server

A Node.js/Express API server for handling event feedback and sentiment analysis with PostgreSQL database storage.

## Features

- **Feedback Collection**: Endpoint to receive and store feedback submissions
- **Sentiment Analysis**: Automatic categorization of feedback as positive, neutral, or negative
- **Analytics**: Real-time aggregation of sentiment data
- **Validation**: Input validation for all API requests
- **PostgreSQL Storage**: Persistent storage for feedback and analytics data

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the server status.

### Submit Feedback
```
POST /api/feedback
```
Accepts feedback submissions with the following payload:
```json
{
  "comment": "Great session!",
  "rating": 5,
  "emotion": "😀",
  "timestamp": "2025-04-04T23:43:00Z",
  "eventId": "tech-conference-2023" // Optional
}
```

### Get Analytics
```
GET /api/analytics
```
Returns aggregated sentiment analytics:
```json
{
  "positive": 65,
  "neutral": 25,
  "negative": 10,
  "total": 100,
  "averageRating": 4.2,
  "emotionBreakdown": {
    "happy": 60,
    "neutral": 30,
    "unhappy": 10
  }
}
```

### Get All Feedback
```
GET /api/feedback
```
Returns all stored feedback entries.

### Get Feedback by ID
```
GET /api/feedback/:id
```
Returns a specific feedback entry by ID.

## Database Setup

This server uses PostgreSQL for feedback storage. Follow these steps to set up the database:

1. Install PostgreSQL on your system if not already installed
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. Create a `.env` file with the following variables:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgres://username:password@localhost:5432/sentiment_dashboard
```
Replace `username` and `password` with your PostgreSQL credentials.

3. Run the database setup script:
```bash
npm run setup-db
```
This script will:
- Create the `sentiment_dashboard` database if it doesn't exist
- Create the necessary tables
- Initialize default analytics data

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Database Schema

### feedback table
```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  emotion VARCHAR(10) NOT NULL,
  sentiment VARCHAR(10),
  event_id VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### analytics table
```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  positive INTEGER DEFAULT 0,
  neutral INTEGER DEFAULT 0,
  negative INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## Integration with the Dashboard

This API server is designed to work with the Event Sentiment Monitor Dashboard. The feedback submissions from the React feedback form are sent to this API, which processes the data and provides real-time sentiment analytics that can be displayed on the dashboard.

## Production Considerations

For production use, consider:

1. Using environment variables for database credentials
2. Adding authentication/authorization for API endpoints
3. Setting up proper logging and monitoring
4. Deploying behind a reverse proxy (Nginx, Apache)
5. Implementing rate limiting to prevent abuse
6. Setting up database backups
7. Using connection pooling for better performance 