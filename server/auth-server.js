/**
 * Authentication Server
 * Handles user login functionality
 */

const database = require('./database');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.LOGIN_PORT || 5501;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
app.use(express.static('../client'));

/**
 * Login endpoint
 * POST /login
 */
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                message: 'Username and password are required' 
            });
        }
        
        // Authenticate user
        if (await database.auth(username, password)) {
            const userData = await database.getData(username);
            
            if (userData) {
                res.status(200).json({
                    message: 'Authentication successful',
                    data: userData
                });
            } else {
                res.status(500).json({
                    message: 'Failed to retrieve user data'
                });
            }
        } else {
            res.status(401).json({
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
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
    res.status(200).json({ status: 'OK', service: 'Login Server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Login server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down login server...');
    database.closeConnection();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Shutting down login server...');
    database.closeConnection();
    process.exit(0);
});