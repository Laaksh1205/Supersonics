# Event Sentiment Monitor Dashboard

A real-time dashboard for event organizers to monitor attendee sentiment and quickly respond to issues during events, with an integrated feedback collection system and PostgreSQL-backed API server.

## Project Components

This project consists of three main components:

1. **Dashboard UI** - A real-time monitoring dashboard for event organizers
2. **Feedback Collection** - A React component for collecting attendee feedback
3. **API Server** - An Express backend with PostgreSQL for processing and analyzing feedback

## Dashboard Features

- **Real-time Sentiment Analysis**: Monitor positive, neutral, and negative feedback from multiple sources
- **Trend Visualization**: Track sentiment changes over time with dynamic charts
- **Alert System**: Color-coded alerts with severity levels for quick issue identification
- **Multi-channel Feedback Aggregation**: Combines data from social media, in-app chats, and direct feedback
- **Quick Action Tools**: Dispatch staff, make announcements, and request technical support with one click

## Feedback Form Features

- **Clean Material-UI Design**: Intuitive user interface built with React and Material-UI
- **Star Rating System**: 5-star rating collection for quantitative feedback
- **Emotion Selection**: Visual emotion indicators for qualitative feedback
- **Comment Collection**: Text area with character counting and validation
- **Form Validation**: Required field validation with helpful error messages
- **Real-time API Integration**: Submits feedback to the API server for immediate analysis

## API Server Features

- **Feedback Collection**: RESTful endpoint for receiving feedback
- **Sentiment Analysis**: Automatic categorization based on ratings and emotions
- **Analytics API**: Endpoint for retrieving aggregated sentiment data
- **Validation**: Input validation for all requests
- **PostgreSQL Integration**: Persistent storage for feedback and analytics
- **Real-time Updates**: Processes feedback immediately for dashboard updates

## Project Structure

```
Sentiment-Monitor-Dashboard/
├── index.html              - Main dashboard HTML
├── styles.css              - Dashboard styling
├── app.js                  - Dashboard functionality
├── mockData.js             - Sample data for dashboard
├── start.js                - Development startup script
│
├── src/                    - React Feedback Component
│   ├── components/
│   │   └── feedback/
│   │       ├── FeedbackForm.jsx     - Feedback collection form
│   │       └── FeedbackDemo.jsx     - Demo implementation
│   ├── services/
│   │   └── api.js                   - API client service
│   ├── index.js                     - React entry point
│   └── package.json                 - React dependencies
│
└── server/                 - Express API Server with PostgreSQL
    ├── server.js                    - API implementation
    ├── db/                          - Database connection and setup
    │   └── index.js                 - PostgreSQL configuration
    ├── models/                      - Data models
    │   └── feedback.js              - Feedback operations
    ├── setup-db.js                  - Database initialization script
    ├── package.json                 - Server dependencies
    └── .env                         - Server configuration
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)

### Dashboard Only

1. Open `index.html` in a web browser
2. The dashboard will load with mock data

### Full Stack Development

1. **Database Setup**:
   - Install PostgreSQL
   - Create a database: `sentiment_dashboard`
   - Update server/.env with your database credentials

2. **Server Setup**:
   ```bash
   cd server
   npm install
   npm run setup-db
   npm start
   ```

3. **Client Setup**:
   ```bash
   cd src
   npm install
   npm start
   ```

4. **Run Both**:
   ```bash
   node start.js
   ```

## Database Schema

```sql
-- Feedback table
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  emotion VARCHAR(10) NOT NULL,
  sentiment VARCHAR(10),
  event_id VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  positive INTEGER DEFAULT 0,
  neutral INTEGER DEFAULT 0,
  negative INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

- `GET /api/health` - Server health check
- `POST /api/feedback` - Submit new feedback
- `GET /api/analytics` - Get sentiment analytics
- `GET /api/feedback` - Get all feedback entries
- `GET /api/feedback/:id` - Get specific feedback by ID

## Future Enhancements

- User authentication system
- Advanced database queries for detailed analytics
- Natural Language Processing for advanced sentiment analysis
- Mobile app versions with push notifications
- Social media API integration
- Machine learning for trend prediction and automated response suggestions 