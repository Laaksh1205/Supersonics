// Mock Data for Event Sentiment Dashboard

// Current Sentiment Data
const sentimentData = {
  positive: 65,
  neutral: 25,
  negative: 10
};

// Sentiment Trend Data (last 24 hours)
const sentimentTrend = {
  labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  datasets: [
    {
      label: 'Positive',
      data: [55, 60, 65, 70, 65, 60, 65, 70, 65],
      color: '#4caf50'
    },
    {
      label: 'Neutral',
      data: [30, 25, 20, 15, 25, 30, 25, 20, 25],
      color: '#ff9800'
    },
    {
      label: 'Negative',
      data: [15, 15, 15, 15, 10, 10, 10, 10, 10],
      color: '#f44336'
    }
  ]
};

// Active Alerts Data
const alertsData = [
  {
    id: 'alert-001',
    title: 'Audio issues in Main Hall',
    description: 'Multiple complaints about microphone feedback in the Main Hall during keynote speech.',
    time: '10 minutes ago',
    source: 'Twitter mentions, In-app feedback',
    severity: 'high',
    count: 12
  },
  {
    id: 'alert-002',
    title: 'Long queue at food station',
    description: 'Attendees reporting 20+ minute wait times at the main food station.',
    time: '15 minutes ago',
    source: 'In-app feedback, Instagram stories',
    severity: 'high',
    count: 8
  },
  {
    id: 'alert-003',
    title: 'Wi-Fi connectivity issues',
    description: 'Some attendees experiencing intermittent Wi-Fi connectivity in Exhibition Hall B.',
    time: '30 minutes ago',
    source: 'Help desk reports, Twitter mentions',
    severity: 'medium',
    count: 5
  },
  {
    id: 'alert-004',
    title: 'Registration system slow',
    description: 'Registration process taking longer than usual for new attendees.',
    time: '45 minutes ago',
    source: 'Staff reports, In-app feedback',
    severity: 'medium',
    count: 4
  },
  {
    id: 'alert-005',
    title: 'Bathroom supplies low',
    description: 'Bathroom in West Wing reported to be low on paper towels.',
    time: '1 hour ago',
    source: 'In-app feedback',
    severity: 'low',
    count: 2
  }
];

// Alert Counts by Severity
const alertCounts = {
  high: 2,
  medium: 5,
  low: 12
};

// Live Feedback Feed Data
const feedbackData = [
  {
    id: 'feedback-001',
    user: 'techEnthusiast22',
    platform: 'twitter',
    content: 'Loving the keynote speech at #TechConference2023! The speaker is absolutely engaging! 👏',
    time: '2 minutes ago',
    sentiment: 'positive'
  },
  {
    id: 'feedback-002',
    user: 'conferenceGoer',
    platform: 'app',
    content: 'The audio in the main hall has terrible feedback. Can barely hear the speaker! Please fix ASAP.',
    time: '5 minutes ago',
    sentiment: 'negative'
  },
  {
    id: 'feedback-003',
    user: 'eventPhotographer',
    platform: 'instagram',
    content: 'Great lighting and stage setup at #TechConference2023. Perfect for photos!',
    time: '8 minutes ago',
    sentiment: 'positive'
  },
  {
    id: 'feedback-004',
    user: 'businessAnalyst',
    platform: 'twitter',
    content: 'The networking session was okay, but wish there were more industry experts to talk to. #TechConference2023',
    time: '12 minutes ago',
    sentiment: 'neutral'
  },
  {
    id: 'feedback-005',
    user: 'developerJane',
    platform: 'app',
    content: 'Been waiting in line for food for 25 minutes now. This is ridiculous!',
    time: '15 minutes ago',
    sentiment: 'negative'
  },
  {
    id: 'feedback-006',
    user: 'startupFounder',
    platform: 'twitter',
    content: 'Just had an amazing conversation with @innovationGuru at #TechConference2023. So many insights!',
    time: '18 minutes ago',
    sentiment: 'positive'
  },
  {
    id: 'feedback-007',
    user: 'productManager',
    platform: 'app',
    content: 'Workshop in Room 3B was informative but slides were hard to read from the back.',
    time: '20 minutes ago',
    sentiment: 'neutral'
  },
  {
    id: 'feedback-008',
    user: 'techBlogger',
    platform: 'instagram',
    content: 'Check out these awesome gadgets at the #TechConference2023 exhibition!',
    time: '25 minutes ago',
    sentiment: 'positive'
  },
  {
    id: 'feedback-009',
    user: 'attendee123',
    platform: 'twitter',
    content: 'Wi-Fi keeps dropping in the exhibition hall. How am I supposed to tweet? #TechConference2023',
    time: '30 minutes ago',
    sentiment: 'negative'
  },
  {
    id: 'feedback-010',
    user: 'industryAnalyst',
    platform: 'app',
    content: "The panel discussion on AI ethics raised some interesting points, but didn't go deep enough.",
    time: '35 minutes ago',
    sentiment: 'neutral'
  }
];

// WebSocket mock for real-time updates
let mockWebSocket = {
  onmessage: null,
  send: function(data) {
    console.log('Mock WebSocket message sent:', data);
  }
};

// Simulate incoming real-time data
function simulateRealTimeUpdates() {
  // Simulate a new feedback message
  setTimeout(() => {
    const newFeedback = {
      type: 'newFeedback',
      data: {
        id: `feedback-${Date.now()}`,
        user: 'newAttendee',
        platform: ['twitter', 'instagram', 'app'][Math.floor(Math.random() * 3)],
        content: 'Just arrived at the conference! The check-in was super smooth. #TechConference2023',
        time: 'Just now',
        sentiment: 'positive'
      }
    };
    
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(newFeedback) });
    }
  }, 10000);
  
  // Simulate an alert update
  setTimeout(() => {
    const alertUpdate = {
      type: 'alertUpdate',
      data: {
        id: 'alert-003',
        title: 'Wi-Fi connectivity issues',
        description: 'Wi-Fi issues in Exhibition Hall B are being addressed by IT team.',
        time: 'Just now',
        source: 'Staff update',
        severity: 'medium',
        status: 'in-progress'
      }
    };
    
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(alertUpdate) });
    }
  }, 15000);
  
  // Simulate a sentiment update
  setTimeout(() => {
    const sentimentUpdate = {
      type: 'sentimentUpdate',
      data: {
        positive: 68,
        neutral: 22,
        negative: 10,
        timestamp: new Date().toISOString()
      }
    };
    
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(sentimentUpdate) });
    }
  }, 20000);
}

// Function to get alert counts
function getAlertCounts() {
  return alertCounts;
}

// Function to get alerts data
function getAlertsData() {
  return alertsData;
}

// Function to get sentiment data
function getSentimentData() {
  return sentimentData;
}

// Function to get sentiment trend data
function getSentimentTrendData() {
  return sentimentTrend;
}

// Function to get feedback data
function getFeedbackData() {
  return feedbackData;
}

// Function to get mock WebSocket
function getMockWebSocket() {
  return mockWebSocket;
}

// Export mock data and functions
window.eventDashboard = {
  getAlertCounts,
  getAlertsData,
  getSentimentData,
  getSentimentTrendData,
  getFeedbackData,
  getMockWebSocket,
  simulateRealTimeUpdates
}; 