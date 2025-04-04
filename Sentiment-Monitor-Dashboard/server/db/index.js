const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err.message);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Initialize database schema
const initializeDatabase = async () => {
  try {
    // Create feedback table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        emotion VARCHAR(10) NOT NULL,
        sentiment VARCHAR(10),
        event_id VARCHAR(50),
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // Create analytics table to store current sentiment data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        positive INTEGER DEFAULT 0,
        neutral INTEGER DEFAULT 0,
        negative INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    // Create an initial analytics record if it doesn't exist
    const analyticsCheck = await pool.query('SELECT COUNT(*) FROM analytics');
    if (parseInt(analyticsCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO analytics (positive, neutral, negative, total, last_updated)
        VALUES (65, 25, 10, 0, NOW());
      `);
    }
    
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database schema:', error.message);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initializeDatabase
}; 