// Event Sentiment Dashboard Application

// Initialize the dashboard when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupEventListeners();
  // Start simulating real-time updates
  window.eventDashboard.simulateRealTimeUpdates();
});

// Initialize dashboard components
function initializeDashboard() {
  renderSentimentPieChart();
  renderSentimentTrendChart();
  renderAlerts();
  renderFeedbackFeed();
  setupWebSocketConnection();
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons for feed
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Filter feed based on selected platform
      const platform = this.getAttribute('data-filter');
      filterFeedByPlatform(platform);
    });
  });
  
  // Refresh button
  document.querySelector('.refresh-btn').addEventListener('click', refreshData);
  
  // Event selector
  document.getElementById('event-select').addEventListener('change', changeEvent);
}

// Render sentiment pie chart
function renderSentimentPieChart() {
  const sentimentData = window.eventDashboard.getSentimentData();
  const ctx = document.getElementById('sentimentPieChart').getContext('2d');
  
  // Create the pie chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: [
          '#4caf50',  // positive - green
          '#ff9800',  // neutral - orange
          '#f44336'   // negative - red
        ],
        borderColor: [
          '#388e3c',
          '#f57c00',
          '#d32f2f'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  
  // Update the sentiment summary percentages
  document.querySelector('.sentiment-stat.positive .percentage').textContent = `${sentimentData.positive}%`;
  document.querySelector('.sentiment-stat.neutral .percentage').textContent = `${sentimentData.neutral}%`;
  document.querySelector('.sentiment-stat.negative .percentage').textContent = `${sentimentData.negative}%`;
}

// Render sentiment trend chart
function renderSentimentTrendChart() {
  const trendData = window.eventDashboard.getSentimentTrendData();
  const ctx = document.getElementById('sentimentTrendChart').getContext('2d');
  
  // Create the line chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.labels,
      datasets: [
        {
          label: 'Positive',
          data: trendData.datasets[0].data,
          borderColor: trendData.datasets[0].color,
          backgroundColor: `${trendData.datasets[0].color}20`,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Neutral',
          data: trendData.datasets[1].data,
          borderColor: trendData.datasets[1].color,
          backgroundColor: `${trendData.datasets[1].color}20`,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Negative',
          data: trendData.datasets[2].data,
          borderColor: trendData.datasets[2].color,
          backgroundColor: `${trendData.datasets[2].color}20`,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Render alerts
function renderAlerts() {
  const alertsData = window.eventDashboard.getAlertsData();
  const alertCounts = window.eventDashboard.getAlertCounts();
  const alertsContainer = document.getElementById('alerts-container');
  
  // Update alert counts
  document.querySelector('.alert-level.high .count').textContent = alertCounts.high;
  document.querySelector('.alert-level.medium .count').textContent = alertCounts.medium;
  document.querySelector('.alert-level.low .count').textContent = alertCounts.low;
  
  // Clear existing alerts
  alertsContainer.innerHTML = '';
  
  // Add alerts to the container
  alertsData.forEach(alert => {
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.severity}`;
    alertElement.id = alert.id;
    
    alertElement.innerHTML = `
      <div class="alert-header">
        <span class="alert-title">${alert.title}</span>
        <span class="alert-time">${alert.time}</span>
      </div>
      <div class="alert-description">${alert.description}</div>
      <div class="alert-source">Source: ${alert.source}</div>
    `;
    
    alertsContainer.appendChild(alertElement);
  });
}

// Render feedback feed
function renderFeedbackFeed() {
  const feedbackData = window.eventDashboard.getFeedbackData();
  const feedbackContainer = document.getElementById('feedback-container');
  
  // Clear existing feedback
  feedbackContainer.innerHTML = '';
  
  // Add feedback items to the container
  feedbackData.forEach(feedback => {
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feed-item platform-${feedback.platform}`;
    feedbackElement.id = feedback.id;
    
    feedbackElement.innerHTML = `
      <div class="feed-item-header">
        <div class="feed-item-user">
          <span class="material-icons">account_circle</span>
          ${feedback.user}
          <span class="feed-item-platform platform-${feedback.platform}">${feedback.platform}</span>
        </div>
        <span class="feed-item-time">${feedback.time}</span>
      </div>
      <div class="feed-item-content">${feedback.content}</div>
      <span class="feed-item-sentiment sentiment-${feedback.sentiment}">${feedback.sentiment}</span>
    `;
    
    feedbackContainer.appendChild(feedbackElement);
  });
}

// Filter feed by platform
function filterFeedByPlatform(platform) {
  const feedItems = document.querySelectorAll('.feed-item');
  
  feedItems.forEach(item => {
    if (platform === 'all' || item.classList.contains(`platform-${platform}`)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Refresh data
function refreshData() {
  console.log('Refreshing dashboard data...');
  
  // Simulate data refresh with a loading indicator
  document.querySelector('.refresh-btn').textContent = 'Refreshing...';
  
  setTimeout(() => {
    // Re-render all components
    renderSentimentPieChart();
    renderSentimentTrendChart();
    renderAlerts();
    renderFeedbackFeed();
    
    // Restore button text
    document.querySelector('.refresh-btn').textContent = 'Refresh Data';
  }, 1000);
}

// Change event
function changeEvent() {
  const eventSelect = document.getElementById('event-select');
  const selectedEvent = eventSelect.value;
  
  console.log(`Changing to event: ${selectedEvent}`);
  
  // Simulate loading data for the selected event
  document.querySelector('.refresh-btn').textContent = 'Loading...';
  
  setTimeout(() => {
    // Re-render all components (in a real app, would fetch new data for the selected event)
    renderSentimentPieChart();
    renderSentimentTrendChart();
    renderAlerts();
    renderFeedbackFeed();
    
    // Restore button text
    document.querySelector('.refresh-btn').textContent = 'Refresh Data';
  }, 1000);
}

// Setup WebSocket connection for real-time updates
function setupWebSocketConnection() {
  const ws = window.eventDashboard.getMockWebSocket();
  
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    // Handle different types of real-time updates
    switch (data.type) {
      case 'newFeedback':
        addNewFeedback(data.data);
        break;
      case 'alertUpdate':
        updateAlert(data.data);
        break;
      case 'sentimentUpdate':
        updateSentiment(data.data);
        break;
    }
  };
}

// Add new feedback to the feed
function addNewFeedback(feedback) {
  const feedbackContainer = document.getElementById('feedback-container');
  
  // Create new feedback element
  const feedbackElement = document.createElement('div');
  feedbackElement.className = `feed-item platform-${feedback.platform}`;
  feedbackElement.id = feedback.id;
  
  feedbackElement.innerHTML = `
    <div class="feed-item-header">
      <div class="feed-item-user">
        <span class="material-icons">account_circle</span>
        ${feedback.user}
        <span class="feed-item-platform platform-${feedback.platform}">${feedback.platform}</span>
      </div>
      <span class="feed-item-time">${feedback.time}</span>
    </div>
    <div class="feed-item-content">${feedback.content}</div>
    <span class="feed-item-sentiment sentiment-${feedback.sentiment}">${feedback.sentiment}</span>
  `;
  
  // Add the new feedback to the top of the feed
  feedbackContainer.prepend(feedbackElement);
  
  // Highlight the new item briefly
  feedbackElement.style.backgroundColor = '#f0f8ff';
  setTimeout(() => {
    feedbackElement.style.backgroundColor = '';
  }, 3000);
}

// Update an existing alert
function updateAlert(alert) {
  const alertElement = document.getElementById(alert.id);
  
  if (alertElement) {
    // Update alert content
    alertElement.querySelector('.alert-description').textContent = alert.description;
    alertElement.querySelector('.alert-time').textContent = alert.time;
    alertElement.querySelector('.alert-source').textContent = `Source: ${alert.source}`;
    
    // Add status indicator if provided
    if (alert.status) {
      const statusElement = document.createElement('div');
      statusElement.className = `alert-status ${alert.status}`;
      statusElement.textContent = `Status: ${alert.status}`;
      alertElement.appendChild(statusElement);
    }
    
    // Highlight the updated alert briefly
    alertElement.style.backgroundColor = '#fff8e1';
    setTimeout(() => {
      alertElement.style.backgroundColor = '';
    }, 3000);
  }
}

// Update sentiment data
function updateSentiment(sentimentData) {
  console.log('Updating sentiment data:', sentimentData);
  
  // Update the sentiment summary percentages
  document.querySelector('.sentiment-stat.positive .percentage').textContent = `${sentimentData.positive}%`;
  document.querySelector('.sentiment-stat.neutral .percentage').textContent = `${sentimentData.neutral}%`;
  document.querySelector('.sentiment-stat.negative .percentage').textContent = `${sentimentData.negative}%`;
  
  // Get the pie chart from Chart.js
  const chartId = 'sentimentPieChart';
  const chart = Chart.getChart(chartId);
  
  if (chart) {
    // Update the chart data
    chart.data.datasets[0].data = [
      sentimentData.positive,
      sentimentData.neutral,
      sentimentData.negative
    ];
    
    // Animate the update
    chart.update('300');
    
    // Create a notification
    createNotification('Sentiment data has been updated', 'info');
  }
}

// Quick action functions
function dispatchStaff(location) {
  console.log(`Dispatching staff to ${location}...`);
  
  // Create notification
  createNotification(`Staff dispatched to ${location} area`, 'success');
}

function makeAnnouncement() {
  // In a real app, show a dialog to compose announcement
  const message = prompt('Enter announcement message:');
  
  if (message) {
    console.log(`Making announcement: ${message}`);
    createNotification(`Announcement sent: ${message}`, 'info');
  }
}

function technicalSupport() {
  console.log('Technical support team notified...');
  createNotification('Technical support team has been notified', 'info');
}

// Create notification
function createNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <span class="notification-close material-icons">close</span>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  // Add close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
} 