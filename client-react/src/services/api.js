/**
 * API Service Layer
 * Handles all API communication
 */

import axios from 'axios';
import config from '../config';

// Create axios instance with default config
const api = axios.create({
    baseURL: config.server.auth.url,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication API
export const authAPI = {
    // User login
    login: async (credentials) => {
        try {
            const response = await api.post(config.server.auth.endpoints.login, credentials);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // User registration
    signup: async (userData) => {
        try {
            const response = await api.post(config.server.auth.endpoints.signup, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    // Check username availability
    checkUsername: async (username) => {
        try {
            const response = await api.get(`${config.server.auth.endpoints.checkUsername}?username=${encodeURIComponent(username)}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Username check failed');
        }
    },

    // Update user typing statistics
    updateStats: async (username, wpm, accuracy) => {
        try {
            const response = await api.post('/auth/update-stats', { username, wpm, accuracy });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Stats update failed');
        }
    }
};

// Quotes API
export const quotesAPI = {
    // Get random quote
    getRandomQuote: async () => {
        try {
            const response = await axios.get(config.api.quotes.url, {
                headers: {
                    'X-Api-Key': 'hgLdefTld20KuS/1sYoL6w==Kvdoxvt71AoQWKz1'
                },
                timeout: 5000
            });
            
            if (response.data && response.data[0] && response.data[0].quote) {
                return response.data[0].quote;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            const fallbackTexts = config.api.quotes.fallbackTexts;
            const randomIndex = Math.floor(Math.random() * fallbackTexts.length);
            return fallbackTexts[randomIndex];
        }
    }
};

export default api;
