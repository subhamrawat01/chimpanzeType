/**
 * Database Configuration Module
 * Handles PostgreSQL database connections and user operations
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database client configuration
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ChimpanzeeType",
    password: "1234qwer",
    port: 5432,
});

// Test database connection
pool.on('connect', () => {
});

pool.on('error', (err) => {
});

/**
 * Adds a new user to the database
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - Hashed password
 * @param {string} name - User's full name
 * @returns {boolean|string} - True if successful, error message if failed
 */
async function addUser(username, email, password, name) {
    
    const client = await pool.connect();
    try {
        // Start transaction
        await client.query('BEGIN');
        
        // Check if user already exists (double-check)
        const existingUser = await client.query(
            'SELECT username FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK');
            return 'Username or email already exists';
        }
        
        // Insert new user
        const insertQuery = `
            INSERT INTO users (username, email, password, name, races, speed, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id, username, email, name
        `;
        
        const values = [username, email, password, name, 0, 0];
        
        const result = await client.query(insertQuery, values);
        
        // Commit transaction
        await client.query('COMMIT');
        
        return true;
        
    } catch (error) {
        
        await client.query('ROLLBACK');
        
        // Return specific error messages
        if (error.code === '23505') { // Unique violation
            return 'Username or email already exists';
        } else if (error.code === '42P01') { // Table doesn't exist
            return 'Database table not found - please run migrations';
        } else if (error.code === '42703') { // Column doesn't exist
            return 'Database schema mismatch - please check table structure';
        }
        
        return `Database error: ${error.message}`;
    } finally {
        client.release();
    }
}

/**
 * Authenticates user credentials
 * @param {string} username - User's username
 * @param {string} password - Plain text password
 * @returns {boolean} - True if authentication successful
 */
async function auth(username, password) {
    
    try {
        const query = 'SELECT password FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        
        if (result.rows.length === 0) {
            return false;
        }
        
        const hashedPassword = result.rows[0].password;
        const isValid = await bcrypt.compare(password, hashedPassword);
        
        return isValid;
    } catch (err) {
        return false;
    }
}

/**
 * Retrieves user data - FIXED TO USE CORRECT TABLE
 * @param {string} username - User's username
 * @returns {Object|null} - User data object or null if not found
 */
async function getData(username) {
    
    try {
        // FIXED: Changed from 'userdata' to 'users' table
        const query = 'SELECT username, speed, races, accuracy, name, email FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const userData = result.rows[0];
        return userData;
    } catch (err) {
        return null;
    }
}

/**
 * Checks if username is available
 * @param {string} username - Username to check
 * @returns {boolean} - True if username is available
 */
async function checkUsernameAvailability(username) {
    
    try {
        const result = await pool.query(
            'SELECT username FROM users WHERE username = $1',
            [username]
        );
        
        const isAvailable = result.rows.length === 0;
        
        return isAvailable;
    } catch (error) {
        throw error;
    }
}

/**
 * Updates user typing statistics
 * @param {string} username - User's username
 * @param {number} wpm - Words per minute achieved
 * @param {number} accuracy - Accuracy percentage
 * @returns {Object|null} - Updated user data or null if failed
 */
async function updateUserStats(username, wpm, accuracy) {
    
    const client = await pool.connect();
    try {
        // Start transaction
        await client.query('BEGIN');
        
        // Get current user data
        const currentData = await client.query(
            'SELECT races, speed, accuracy FROM users WHERE username = $1',
            [username]
        );
        
        if (currentData.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        
        const currentRaces = currentData.rows[0].races || 0;
        const currentSpeed = currentData.rows[0].speed || 0;
        const currentAccuracy = currentData.rows[0].accuracy || 0;
        
        // Calculate new averages
        const newRaces = currentRaces + 1;
        const newAverageSpeed = Math.round(((currentSpeed * currentRaces) + wpm) / newRaces);
        const newAverageAccuracy = Math.round(((currentAccuracy * currentRaces) + accuracy) / newRaces);
        
        // Update user stats
        const updateQuery = `
            UPDATE users 
            SET races = $1, speed = $2, accuracy = $3, updated_at = NOW()
            WHERE username = $4
            RETURNING username, races, speed, accuracy, name, email
        `;
        
        const result = await client.query(updateQuery, [newRaces, newAverageSpeed, newAverageAccuracy, username]);
        
        // Commit transaction
        await client.query('COMMIT');
        
        const updatedUser = result.rows[0];
        
        return updatedUser;
        
    } catch (error) {
        await client.query('ROLLBACK');
        return null;
    } finally {
        client.release();
    }
}

/**
 * Initialize database and create tables if they don't exist
 */
async function initializeDatabase() {
    
    const client = await pool.connect();
    try {
        // Create users table with updated schema
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                races INTEGER DEFAULT 0,
                speed INTEGER DEFAULT 0,
                accuracy INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Check table structure
        const tableInfo = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        
        
        return true;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Test database connection and table structure
 */
async function testDatabaseConnection() {
    
    try {
        const client = await pool.connect();
        
        // Check if users table exists
        const tableCheck = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        `);
        
        if (tableCheck.rows.length === 0) {
            await initializeDatabase();
        } else {
        }
        
        client.release();
        return true;
        
    } catch (error) {
        return false;
    }
}

/**
 * Gracefully closes database connection
 */
function closeConnection() {
    pool.end()
        .then(() => {})
        .catch(err => {});
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    closeConnection();
    process.exit(0);
});

process.on('SIGTERM', () => {
    closeConnection();
    process.exit(0);
});

module.exports = {
    addUser,
    auth,
    getData,
    checkUsernameAvailability,
    updateUserStats,
    testDatabaseConnection,
    initializeDatabase,
    closeConnection
};