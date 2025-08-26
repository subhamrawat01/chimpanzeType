/**
 * User Registration Server
 * Handles user signup functionality and username availability checks
 */

const database = require('./database');
const express = require('express');
const hashPasswordMiddleware = require('./hashPasswordMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SIGNUP_PORT || 5502;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * User registration endpoint
 * POST /signup
 */
app.post('/signup', hashPasswordMiddleware, async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        
        // Validate input
        if (!username || !email || !password || !name) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }
        
        // Check if username is available
        const isAvailable = await database.checkUsernameAvailability(username);
        if (!isAvailable) {
            return res.status(409).json({
                message: 'Username is already taken'
            });
        }
        
        // Create user account
        const result = await database.addUser(username, email, password, name);
        
        if (result === true) {
            res.status(201).json({
                message: 'Account successfully created'
            });
        } else {
            res.status(500).json({
                message: result || 'Failed to create account'
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * Username availability check endpoint
 * GET /checkAvailability?username=<username>
 */
app.get('/checkAvailability', async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({
                message: 'Username parameter is required'
            });
        }
        
        const isAvailable = await database.checkUsernameAvailability(username);
        res.status(200).json(isAvailable);
    } catch (error) {
        console.error('Username availability check error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Registration Server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Registration server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down registration server...');
    database.closeConnection();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down registration server...');
    database.closeConnection();
    process.exit(0);
});
