/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    guestData: {
        races: 0,
        totalWpm: 0,
        totalAccuracy: 0,
        bestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0
    }
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    SIGNUP_START: 'SIGNUP_START',
    SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
    SIGNUP_FAILURE: 'SIGNUP_FAILURE',
    LOGOUT: 'LOGOUT',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOAD_USER: 'LOAD_USER',
    UPDATE_GUEST_DATA: 'UPDATE_GUEST_DATA',
    UPDATE_USER_STATS: 'UPDATE_USER_STATS'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.SIGNUP_START:
            return {
                ...state,
                loading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.SIGNUP_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        case AUTH_ACTIONS.LOAD_USER:
            return {
                ...state,
                isAuthenticated: !!action.payload,
                user: action.payload
            };

        case AUTH_ACTIONS.UPDATE_GUEST_DATA:
            const updater = action.payload;
            const newGuestData = typeof updater === 'function' ? updater(state.guestData) : { ...state.guestData, ...updater };
            return {
                ...state,
                guestData: newGuestData
            };

        case AUTH_ACTIONS.UPDATE_USER_STATS:
            return {
                ...state,
                user: action.payload
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('chimpanzeUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: user });
            } catch (error) {
                localStorage.removeItem('chimpanzeUser');
            }
        }
    }, []);

    // Login function
    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });
        
        try {
            const response = await authAPI.login(credentials);
            
            if (response.success && response.data) {
                // Save user data to localStorage
                localStorage.setItem('chimpanzeUser', JSON.stringify(response.data));
                
                dispatch({ 
                    type: AUTH_ACTIONS.LOGIN_SUCCESS, 
                    payload: response.data 
                });
                
                return { success: true };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            dispatch({ 
                type: AUTH_ACTIONS.LOGIN_FAILURE, 
                payload: error.message 
            });
            return { success: false, error: error.message };
        }
    };

    // Signup function
    const signup = async (userData) => {
        dispatch({ type: AUTH_ACTIONS.SIGNUP_START });
        
        try {
            const response = await authAPI.signup(userData);
            
            if (response.success) {
                dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS });
                return { success: true, message: response.message };
            } else {
                throw new Error(response.message || 'Signup failed');
            }
        } catch (error) {
            dispatch({ 
                type: AUTH_ACTIONS.SIGNUP_FAILURE, 
                payload: error.message 
            });
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('chimpanzeUser');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Update guest data function (stored in memory only)
    const updateGuestData = (testResults) => {
        const { wpm, accuracy } = testResults;
        
        dispatch({ 
            type: AUTH_ACTIONS.UPDATE_GUEST_DATA, 
            payload: (prevGuestData) => {
                const newRaces = prevGuestData.races + 1;
                const newTotalWpm = prevGuestData.totalWpm + wpm;
                const newTotalAccuracy = prevGuestData.totalAccuracy + accuracy;
                
                return {
                    races: newRaces,
                    totalWpm: newTotalWpm,
                    totalAccuracy: newTotalAccuracy,
                    bestWpm: Math.max(prevGuestData.bestWpm, wpm),
                    averageWpm: Math.round(newTotalWpm / newRaces),
                    averageAccuracy: Math.round(newTotalAccuracy / newRaces)
                };
            }
        });
    };

    // Update authenticated user stats (stored in database)
    const updateUserStats = async (testResults) => {
        if (!state.isAuthenticated || !state.user) {
            return { success: false, error: 'User not authenticated' };
        }

        try {
            const { wpm, accuracy } = testResults;
            
            const response = await authAPI.updateStats(state.user.username, wpm, accuracy);
            
            if (response.success && response.data) {
                // Update user data in localStorage
                localStorage.setItem('chimpanzeUser', JSON.stringify(response.data));
                
                // Update user data in state
                dispatch({ 
                    type: AUTH_ACTIONS.UPDATE_USER_STATS, 
                    payload: response.data 
                });
                
                return { success: true, data: response.data };
            } else {
                throw new Error(response.message || 'Stats update failed');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Universal update function that handles both authenticated and guest users
    const updateTestResults = async (testResults) => {
        
        if (state.isAuthenticated) {
            return await updateUserStats(testResults);
        } else {
            updateGuestData(testResults);
            return { success: true, message: 'Guest data updated' };
        }
    };

    // Get current user stats (works for both authenticated and guest users)
    const getCurrentUserStats = () => {
        if (state.isAuthenticated && state.user) {
            return {
                username: state.user.username,
                races: state.user.races || 0,
                speed: state.user.speed || 0,
                accuracy: state.user.accuracy || 0
            };
        } else {
            return {
                username: 'Guest',
                races: state.guestData.races,
                speed: state.guestData.averageWpm,
                accuracy: state.guestData.averageAccuracy
            };
        }
    };

    const value = {
        ...state,
        login,
        signup,
        logout,
        clearError,
        updateGuestData,
        updateUserStats,
        updateTestResults,
        getCurrentUserStats
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
