/**
 * Unified Authentication Server
 * Handles both login and user registration functionality + serves frontend
 */

const database = require('./database');
const express = require('express');
const hashPasswordMiddleware = require('./hashPasswordMiddleware');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.AUTH_PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// STATIC FILE SERVING (Frontend)
// ==========================================

let clientPath;

// Serve React build files in production, fallback to old client in development
if (process.env.NODE_ENV === 'production') {
    const reactBuildPath = path.join(__dirname, '../client-react/build');
    app.use(express.static(reactBuildPath));
    clientPath = reactBuildPath;
} else {
    // Development: serve old client as fallback for API testing
    clientPath = path.join(__dirname, '../client');
    app.use('/old', express.static(clientPath));
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

/**
 * User login endpoint
 * POST /auth/login
 */
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Username and password are required' 
            });
        }
        
        // Authenticate user
        if (await database.auth(username, password)) {
            const userData = await database.getData(username);
            
            if (userData) {
                res.status(200).json({
                    success: true,
                    message: 'Authentication successful',
                    data: userData
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve user data'
                });
            }
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * User registration endpoint with detailed debugging
 * POST /auth/signup
 */
app.post('/auth/signup', hashPasswordMiddleware, async (req, res) => {
    
    try {
        const { username, email, password, name } = req.body;
        
        // Validate input
        if (!username || !email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                missing: {
                    username: !username,
                    email: !email,
                    password: !password,
                    name: !name
                }
            });
        }
        
        // Check if username is available
        const isAvailable = await database.checkUsernameAvailability(username);
        
        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'Username is already taken'
            });
        }
        
        // Create user account
        const result = await database.addUser(username, email, password, name);
        
        if (result === true) {
            res.status(201).json({
                success: true,
                message: 'Account successfully created'
            });
        } else {
            res.status(500).json({
                success: false,
                message: result || 'Failed to create account',
                debug: { result }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Username availability check endpoint
 * GET /auth/check-username?username=<username>
 */
app.get('/auth/check-username', async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username parameter is required'
            });
        }
        
        const isAvailable = await database.checkUsernameAvailability(username);
        res.status(200).json({
            success: true,
            available: isAvailable,
            message: isAvailable ? 'Username is available' : 'Username is taken'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * Update user typing statistics endpoint
 * POST /auth/update-stats
 */
app.post('/auth/update-stats', async (req, res) => {
    
    try {
        const { username, wpm, accuracy } = req.body;
        
        // Validate input
        if (!username || typeof wpm !== 'number' || typeof accuracy !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Username, WPM, and accuracy are required',
                received: { username, wpm: typeof wpm, accuracy: typeof accuracy }
            });
        }
        
        if (wpm < 0 || wpm > 300 || accuracy < 0 || accuracy > 100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid WPM or accuracy values',
                received: { wpm, accuracy }
            });
        }
        
        // Update user statistics
        const updatedUser = await database.updateUserStats(username, wpm, accuracy);
        
        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'Stats updated successfully',
                data: updatedUser
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found or update failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ==========================================
// UTILITY ROUTES
// ==========================================

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'Authentication Server',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        frontend: 'Served from /client directory'
    });
});

/**
 * API information endpoint
 * GET /api/info
 */
app.get('/api/info', (req, res) => {
    res.status(200).json({
        service: 'ChimpanzeType Authentication API',
        version: '1.0.0',
        frontend: {
            url: `http://localhost:${PORT}`,
            directory: clientPath
        },
        endpoints: {
            frontend: 'GET /',
            login: 'POST /auth/login',
            signup: 'POST /auth/signup',
            checkUsername: 'GET /auth/check-username',
            health: 'GET /health'
        }
    });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// Catch-all handler for unmatched API routes (should come AFTER all API routes)
app.use('/auth/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Auth endpoint not found: ${req.originalUrl}`
    });
});

app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.originalUrl}`
    });
});

// Final fallback - serve React app for any other routes (SPA behavior)
app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        const reactBuildPath = path.join(__dirname, '../client-react/build');
        res.sendFile(path.join(reactBuildPath, 'index.html'));
    } else {
        // In development, redirect to React dev server
        res.json({
            message: 'API is running. Start React frontend with: npm run client',
            endpoints: {
                reactDev: 'http://localhost:3000',
                api: `http://localhost:${PORT}/api/info`,
                health: `http://localhost:${PORT}/health`
            }
        });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ==========================================
// SERVER STARTUP
// ==========================================

// Initialize database before starting server
async function startServer() {
    try {
        await database.testDatabaseConnection();
        
        // Start server
        app.listen(PORT, () => {
        });
    } catch (error) {
        process.exit(1);
    }
}

// Start the server
startServer();

// Handle graceful shutdown
const gracefulShutdown = (signal) => {
    database.closeConnection();
    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = app;