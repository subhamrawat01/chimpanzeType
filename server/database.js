/**
 * Database Configuration Module
 * Handles PostgreSQL database connections and user operations
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database client configuration
const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    port: process.env.DB_PORT || 5432,
    password: process.env.DB_PASSWORD || '1234qwer',
    database: process.env.DB_NAME || 'ChimpanzeeType',
});

// Connect to database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err));

/**
 * Adds a new user to the database
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - Hashed password
 * @param {string} name - User's full name
 * @returns {boolean|string} - True if successful, error message if failed
 */
function addUser(username, email, password, name) {
    try {
        // Using parameterized queries to prevent SQL injection
        const userQuery = 'INSERT INTO users (email, username, password, name) VALUES ($1, $2, $3, $4)';
        const userDataQuery = 'INSERT INTO userdata (username) VALUES ($1)';
        
        client.query(userQuery, [email, username, password, name]);
        client.query(userDataQuery, [username]);
        
        return true;
    } catch (err) {
        console.error('Error adding user:', err.message);
        return err.message;
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
        const result = await client.query(query, [username]);
        
        if (result.rows.length === 0) {
            return false;
        }
        
        const hashedPassword = result.rows[0].password;
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error('Authentication error:', err.message);
        return false;
    }
}

/**
 * Retrieves user data
 * @param {string} username - User's username
 * @returns {Object|null} - User data object or null if not found
 */
async function getData(username) {
    try {
        const query = 'SELECT username, speed, races FROM userdata WHERE username = $1';
        const result = await client.query(query, [username]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user data:', err.message);
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
        const query = 'SELECT COUNT(*) FROM userdata WHERE username = $1';
        const result = await client.query(query, [username]);
        
        return parseInt(result.rows[0].count) === 0;
    } catch (err) {
        console.error('Error checking username availability:', err.message);
        return false;
    }
}

/**
 * Gracefully closes database connection
 */
function closeConnection() {
    client.end()
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
    closeConnection
};