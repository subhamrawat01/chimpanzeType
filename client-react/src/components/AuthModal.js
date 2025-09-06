/**
 * Authentication Modal Component
 * Handles login and registration forms
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import * as S from '../styles/GlobalStyles';

const AuthModal = ({ isOpen, onClose }) => {
    const { login, signup, loading, clearError } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        // Login fields
        loginUsername: '',
        loginPassword: '',
        
        // Signup fields
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    
    const [validation, setValidation] = useState({});
    const [usernameCheck, setUsernameCheck] = useState({
        status: '', // 'checking', 'available', 'unavailable', 'error'
        message: ''
    });
    const [authMessage, setAuthMessage] = useState({ type: '', text: '' });

    // Clear form and messages when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            clearError();
            setAuthMessage({ type: '', text: '' });
        } else {
            // Reset form when closing
            setFormData({
                loginUsername: '',
                loginPassword: '',
                name: '',
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            });
            setValidation({});
            setUsernameCheck({ status: '', message: '' });
        }
    }, [isOpen, clearError]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear validation error for this field
        if (validation[field]) {
            setValidation(prev => ({ ...prev, [field]: '' }));
        }
        
        // Clear auth message
        if (authMessage.text) {
            setAuthMessage({ type: '', text: '' });
        }
        
        // Username availability check for signup
        if (field === 'username' && activeTab === 'signup') {
            checkUsernameAvailability(value);
        }
    };

    // Debounced username availability check
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.username && activeTab === 'signup' && formData.username.length >= 3) {
                checkUsernameAvailabilityAPI(formData.username);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.username, activeTab]);

    const checkUsernameAvailability = (username) => {
        if (!username || username.length < 3) {
            setUsernameCheck({ status: '', message: '' });
            return;
        }
        
        if (username.length > 100) {
            setUsernameCheck({ 
                status: 'error', 
                message: 'Username must be less than 100 characters' 
            });
            return;
        }
        
        if (!/^[a-zA-Z0-9_@.-]+$/.test(username)) {
            setUsernameCheck({ 
                status: 'error', 
                message: 'Username can only contain letters, numbers, underscores, @ and periods' 
            });
            return;
        }
        
        setUsernameCheck({ status: 'checking', message: 'Checking availability...' });
    };

    const checkUsernameAvailabilityAPI = async (username) => {
        try {
            const response = await authAPI.checkUsername(username);
            if (response.success) {
                setUsernameCheck({
                    status: response.available ? 'available' : 'unavailable',
                    message: response.available ? '✅ Username is available' : '❌ Username is unavailable'
                });
            }
        } catch (error) {
            setUsernameCheck({
                status: 'error',
                message: 'Error checking availability'
            });
        }
    };

    // Form validation
    const validateLoginForm = () => {
        const errors = {};
        
        if (!formData.loginUsername.trim()) {
            errors.loginUsername = 'Please enter your username';
        } else if (formData.loginUsername.length > 100) {
            errors.loginUsername = 'Username is too long';
        }
        
        if (!formData.loginPassword) {
            errors.loginPassword = 'Please enter your password';
        }
        
        setValidation(errors);
        return Object.keys(errors).length === 0;
    };

    const validateSignupForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Please enter your full name';
        } else if (formData.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Please enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!formData.username.trim()) {
            errors.username = 'Please enter a username';
        } else if (usernameCheck.status !== 'available') {
            errors.username = 'Please ensure username is available';
        }
        
        if (!formData.password) {
            errors.password = 'Please enter a password';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setValidation(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateLoginForm()) return;
        
        const result = await login({
            username: formData.loginUsername,
            password: formData.loginPassword
        });
        
        if (result.success) {
            setAuthMessage({ type: 'success', text: 'Login successful! 🎉' });
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setAuthMessage({ type: 'error', text: result.error });
        }
    };

    // Handle signup
    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!validateSignupForm()) return;
        
        const result = await signup({
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password
        });
        
        if (result.success) {
            setAuthMessage({ type: 'success', text: 'Account created successfully! 🎉 Please sign in with your new account.' });
            
            // Clear signup form
            setFormData(prev => ({
                ...prev,
                name: '',
                email: '',
                username: '',
                password: '',
                confirmPassword: ''
            }));
            
            // Switch to login tab after 3 seconds
            setTimeout(() => {
                setActiveTab('login');
            }, 3000);
        } else {
            setAuthMessage({ type: 'error', text: result.error });
        }
    };

    if (!isOpen) return null;

    return (
        <S.ModalOverlay onClick={onClose}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
                {/* Login Section */}
                <S.FormSection>
                    <S.FormToggle 
                        active={activeTab === 'login'}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </S.FormToggle>
                    
                    <S.FormContainer visible={activeTab === 'login'}>
                        <form onSubmit={handleLogin}>
                            <S.FormTable>
                                <tbody>
                                    <tr>
                                        <th><label htmlFor="login-username">Username</label></th>
                                        <td>
                                            <S.FormInput
                                                type="text"
                                                id="login-username"
                                                value={formData.loginUsername}
                                                onChange={(e) => handleInputChange('loginUsername', e.target.value)}
                                                maxLength="100"
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage type="error">
                                                {validation.loginUsername}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="login-password">Password</label></th>
                                        <td>
                                            <S.FormInput
                                                type="password"
                                                id="login-password"
                                                value={formData.loginPassword}
                                                onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage type="error">
                                                {validation.loginPassword}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <S.AuthMessage type={authMessage.type}>
                                                {authMessage.text}
                                            </S.AuthMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <S.FormButton 
                                                type="submit" 
                                                disabled={loading}
                                            >
                                                {loading ? 'Signing In...' : 'Login'}
                                            </S.FormButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </S.FormTable>
                        </form>
                    </S.FormContainer>
                </S.FormSection>

                <hr />

                {/* Create Account Section */}
                <S.FormSection>
                    <S.FormToggle 
                        active={activeTab === 'signup'}
                        onClick={() => setActiveTab('signup')}
                    >
                        Create Account
                    </S.FormToggle>
                    
                    <S.FormContainer visible={activeTab === 'signup'}>
                        <form onSubmit={handleSignup}>
                            <S.FormTable>
                                <tbody>
                                    <tr>
                                        <th><label htmlFor="create-name">Name</label></th>
                                        <td>
                                            <S.FormInput
                                                type="text"
                                                id="create-name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage type="error">
                                                {validation.name}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="create-email">Email</label></th>
                                        <td>
                                            <S.FormInput
                                                type="email"
                                                id="create-email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage type="error">
                                                {validation.email}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="create-username">Username</label></th>
                                        <td>
                                            <S.FormInput
                                                type="text"
                                                id="create-username"
                                                value={formData.username}
                                                onChange={(e) => handleInputChange('username', e.target.value)}
                                                maxLength="100"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <S.CheckButton 
                                                type="button"
                                                onClick={() => checkUsernameAvailabilityAPI(formData.username)}
                                            >
                                                Check Availability
                                            </S.CheckButton>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage 
                                                type={usernameCheck.status === 'available' ? 'success' : 'error'}
                                            >
                                                {usernameCheck.message || validation.username}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="create-password">Password</label></th>
                                        <td>
                                            <S.FormInput
                                                type="password"
                                                id="create-password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label htmlFor="confirm-password">Confirm Password</label></th>
                                        <td>
                                            <S.FormInput
                                                type="password"
                                                id="confirm-password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <S.ValidationMessage type="error">
                                                {validation.password || validation.confirmPassword}
                                            </S.ValidationMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <S.AuthMessage type={authMessage.type}>
                                                {authMessage.text}
                                            </S.AuthMessage>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            <S.FormButton 
                                                type="submit" 
                                                disabled={loading}
                                            >
                                                {loading ? 'Creating Account...' : 'Submit'}
                                            </S.FormButton>
                                        </td>
                                    </tr>
                                </tbody>
                            </S.FormTable>
                        </form>
                    </S.FormContainer>
                </S.FormSection>
            </S.ModalContent>
        </S.ModalOverlay>
    );
};

export default AuthModal;
