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

// Serve static files from client directory
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

// Serve index.html for any unmatched routes (SPA fallback)
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

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
        console.error('Login error:', error);
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
    console.log('🔍 Signup request received');
    console.log('📝 Request body:', req.body);
    console.log('📝 Headers:', req.headers);
    
    try {
        const { username, email, password, name } = req.body;
        
        console.log('📋 Extracted data:', { username, email, name, passwordLength: password?.length });
        
        // Validate input
        if (!username || !email || !password || !name) {
            console.log('❌ Validation failed - missing fields');
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
        
        console.log('✅ Input validation passed');
        
        // Check if username is available
        console.log('🔍 Checking username availability...');
        const isAvailable = await database.checkUsernameAvailability(username);
        console.log('📊 Username available:', isAvailable);
        
        if (!isAvailable) {
            console.log('❌ Username taken');
            return res.status(409).json({
                success: false,
                message: 'Username is already taken'
            });
        }
        
        console.log('✅ Username available, attempting to create user...');
        
        // Create user account
        const result = await database.addUser(username, email, password, name);
        console.log('📊 Database result:', result);
        
        if (result === true) {
            console.log('✅ User created successfully');
            res.status(201).json({
                success: true,
                message: 'Account successfully created'
            });
        } else {
            console.log('❌ User creation failed:', result);
            res.status(500).json({
                success: false,
                message: result || 'Failed to create account',
                debug: { result }
            });
        }
    } catch (error) {
        console.error('💥 Signup error:', error);
        console.error('📊 Error stack:', error.stack);
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
        console.error('Username availability check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
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

// Final fallback - serve index.html for any other routes (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
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
        console.log('🔄 Initializing database...');
        await database.testDatabaseConnection();
        console.log('✅ Database initialization complete');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 ChimpanzeType Server running on port ${PORT}`);
            console.log(`🌐 Frontend: http://localhost:${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}/api/info`);
            console.log(`📊 Health: http://localhost:${PORT}/health`);
            console.log(`📁 Serving static files from: ${clientPath}`);
        });
    } catch (error) {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

// Handle graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n📝 Received ${signal}, shutting down gracefully...`);
    database.closeConnection();
    process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = app;