/**
 * Database setup script for PostgreSQL
 * 
 * Run this script to create the PostgreSQL database and initialize tables
 * 
 * Usage: node setup-db.js
 */

const { Client } = require('pg');
require('dotenv').config();

// Extract database name from DATABASE_URL
const databaseUrlParts = process.env.DATABASE_URL.split('/');
const dbName = databaseUrlParts[databaseUrlParts.length - 1].split('?')[0];

// Create connection to default postgres database
const client = new Client({
  connectionString: process.env.DATABASE_URL.replace(`/${dbName}`, '/postgres')
});

async function setupDatabase() {
  try {
    // Connect to postgres
    await client.connect();
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    // Create database if it doesn't exist
    if (checkDb.rowCount === 0) {
      console.log(`Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
    
    // Close connection to postgres
    await client.end();
    console.log('Connection to postgres closed');
    
    // Connect to the newly created database
    const dbClient = new Client({
      connectionString: process.env.DATABASE_URL
    });
    await dbClient.connect();
    console.log(`Connected to "${dbName}" database`);
    
    // Create tables
    console.log('Creating tables...');
    
    // Feedback table
    await dbClient.query(`
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
    console.log('Created feedback table');
    
    // Analytics table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        positive INTEGER DEFAULT 0,
        neutral INTEGER DEFAULT 0,
        negative INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Created analytics table');
    
    // Create an initial analytics record if it doesn't exist
    const analyticsCheck = await dbClient.query('SELECT COUNT(*) FROM analytics');
    if (parseInt(analyticsCheck.rows[0].count) === 0) {
      await dbClient.query(`
        INSERT INTO analytics (positive, neutral, negative, total, last_updated)
        VALUES (65, 25, 10, 0, NOW());
      `);
      console.log('Initialized analytics data');
    }
    
    // Close connection
    await dbClient.end();
    console.log('Database setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 