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
    console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
    console.error('💥 Database connection error:', err);
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
    console.log('🔍 Database addUser called with:', { username, email, name, passwordLength: password?.length });
    
    const client = await pool.connect();
    try {
        // Start transaction
        await client.query('BEGIN');
        console.log('📝 Transaction started');
        
        // Check if user already exists (double-check)
        const existingUser = await client.query(
            'SELECT username FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        
        if (existingUser.rows.length > 0) {
            console.log('❌ User already exists:', existingUser.rows[0]);
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
        console.log('📝 Executing query:', insertQuery);
        console.log('📝 With values:', [username, email, '[HASHED]', name, 0, 0]);
        
        const result = await client.query(insertQuery, values);
        console.log('📊 Insert result:', result.rows);
        
        // Commit transaction
        await client.query('COMMIT');
        console.log('✅ Transaction committed');
        
        return true;
        
    } catch (error) {
        console.error('💥 Database error in addUser:', error);
        console.error('📊 Error details:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            constraint: error.constraint
        });
        
        await client.query('ROLLBACK');
        console.log('🔄 Transaction rolled back');
        
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
        console.log('🔄 Database connection released');
    }
}

/**
 * Authenticates user credentials
 * @param {string} username - User's username
 * @param {string} password - Plain text password
 * @returns {boolean} - True if authentication successful
 */
async function auth(username, password) {
    console.log('🔍 Authenticating user:', username);
    
    try {
        const query = 'SELECT password FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        
        console.log('📊 Auth query result:', result.rows.length > 0 ? 'User found' : 'User not found');
        
        if (result.rows.length === 0) {
            console.log('❌ User not found in database');
            return false;
        }
        
        const hashedPassword = result.rows[0].password;
        const isValid = await bcrypt.compare(password, hashedPassword);
        
        console.log('📊 Password comparison result:', isValid);
        return isValid;
    } catch (err) {
        console.error('💥 Authentication error:', err.message);
        return false;
    }
}

/**
 * Retrieves user data - FIXED TO USE CORRECT TABLE
 * @param {string} username - User's username
 * @returns {Object|null} - User data object or null if not found
 */
async function getData(username) {
    console.log('🔍 Getting user data for:', username);
    
    try {
        // FIXED: Changed from 'userdata' to 'users' table
        const query = 'SELECT username, speed, races, name, email FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        
        console.log('📊 getData query result:', result.rows.length > 0 ? 'Data found' : 'No data found');
        
        if (result.rows.length === 0) {
            console.log('❌ User data not found for:', username);
            return null;
        }
        
        const userData = result.rows[0];
        console.log('📊 User data retrieved:', userData);
        return userData;
    } catch (err) {
        console.error('💥 Error getting user data:', err.message);
        return null;
    }
}

/**
 * Checks if username is available
 * @param {string} username - Username to check
 * @returns {boolean} - True if username is available
 */
async function checkUsernameAvailability(username) {
    console.log('🔍 Checking username availability for:', username);
    
    try {
        const result = await pool.query(
            'SELECT username FROM users WHERE username = $1',
            [username]
        );
        
        const isAvailable = result.rows.length === 0;
        console.log('📊 Username availability result:', { username, available: isAvailable });
        
        return isAvailable;
    } catch (error) {
        console.error('💥 Error checking username availability:', error);
        throw error;
    }
}

/**
 * Initialize database and create tables if they don't exist
 */
async function initializeDatabase() {
    console.log('🚀 Initializing database...');
    
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Users table ready');
        
        // Check table structure
        const tableInfo = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        
        console.log('📋 Table structure:', tableInfo.rows);
        
        return true;
    } catch (error) {
        console.error('💥 Database initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Test database connection and table structure
 */
async function testDatabaseConnection() {
    console.log('🧪 Testing database connection...');
    
    try {
        const client = await pool.connect();
        console.log('✅ Database connection successful');
        
        // Check if users table exists
        const tableCheck = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        `);
        
        if (tableCheck.rows.length === 0) {
            console.log('❌ Users table does not exist');
            await initializeDatabase();
        } else {
            console.log('✅ Users table exists');
        }
        
        client.release();
        return true;
        
    } catch (error) {
        console.error('💥 Database test failed:', error);
        return false;
    }
}

/**
 * Gracefully closes database connection
 */
function closeConnection() {
    pool.end()
        .then(() => console.log('Database connection closed'))
        .catch(err => console.error('Error closing database connection:', err));
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT, closing database connection...');
    closeConnection();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, closing database connection...');
    closeConnection();
    process.exit(0);
});

module.exports = {
    addUser,
    auth,
    getData,
    checkUsernameAvailability,
    testDatabaseConnection,
    initializeDatabase,
    closeConnection
};