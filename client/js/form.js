/**
 * Complete Authentication and Form Management Module
 * Handles login, user creation, username checking, and UI toggle functionality
 */

// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================

const AppState = {
    loginState: false,
    isSubmitting: false,
    currentUser: null,
    usernameCheckTimeout: null
};

// ==========================================
// DOM ELEMENTS CACHE
// ==========================================

const DOMElements = {
    // Login elements
    loginBox: document.getElementById("login-box"),
    loginUsername: document.getElementById("login-username"),
    loginPassword: document.getElementById("login-password"),
    loginButton: document.getElementById("login-button"),
    loginMessage: document.getElementById("login-message"),
    loginUsernameValidation: document.getElementById("login-username-validation"),
    loginPasswordValidation: document.getElementById("login-password-validation"),
    
    // Create account elements
    createAccountBox: document.getElementById("create-account-box"),
    createName: document.getElementById("create-name"),
    createUsername: document.getElementById("create-username"),
    createEmail: document.getElementById("create-email"),
    createPassword: document.getElementById("create-password"),
    confirmCreatePassword: document.getElementById("confirm-create-password"),
    createAccountSubmit: document.getElementById("create-account-submit"),
    createAccountMessage: document.getElementById("create-account-message"),
    
    // Validation elements
    createNameValidation: document.getElementById("create-name-validation"),
    usernameAvailability: document.getElementById("username-availability"),
    createEmailValidation: document.getElementById("create-email-validation"),
    confirmPasswordValidation: document.getElementById("confirm-password-validation"),
    
    // Navigation elements
    signInCreateForm: document.getElementById("sigin-createaccount-form"),
    loginLink: document.getElementById("login-link"),
    createAccountLink: document.getElementById("create-account-link"),
    signInCreateButton: document.getElementById("signin-createaccount-button"),
    
    // User profile elements
    userProfile: document.getElementById("user-profile"),
    usernameDisplay: document.getElementById("username"),
    racesDisplay: document.getElementById("races"),
    averageDisplay: document.getElementById("average"),
    
    // General message element
    authMessage: document.getElementById("auth-message")
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Show validation error message
 */
function showValidationError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = message;
        element.style.display = "flex";
        element.style.color = "red";
        element.classList.add('error-visible');
    }
}

/**
 * Hide validation error message
 */
function hideValidationError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = "";
        element.style.display = "none";
        element.classList.remove('error-visible');
    }
}

/**
 * Show authentication message
 */
function showAuthMessage(message, color = 'red', elementId = 'auth-message') {
    let messageElement = document.getElementById(elementId);
    
    // Try alternative message element if first one doesn't exist
    if (!messageElement) {
        messageElement = DOMElements.authMessage || 
                        DOMElements.loginMessage || 
                        DOMElements.createAccountMessage;
    }
    
    if (messageElement) {
        messageElement.innerHTML = `<p style="color: ${color}; margin: 10px 0; padding: 10px; background: ${color === 'green' ? '#d4edda' : '#f8d7da'}; border-radius: 4px;">${message}</p>`;
        messageElement.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (color === 'green') {
            setTimeout(() => {
                if (messageElement) {
                    messageElement.style.display = 'none';
                    messageElement.innerHTML = '';
                }
            }, 5000);
        }
    } else {
        console.log(`Message: ${message}`);
    }
}

/**
 * Clear all validation errors
 */
function clearAllValidationErrors() {
    const validationIds = [
        'login-username-validation',
        'login-password-validation',
        'create-name-validation',
        'username-availability',
        'create-email-validation',
        'confirm-password-validation'
    ];
    
    validationIds.forEach(id => hideValidationError(id));
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function for username checking
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// UI TOGGLE FUNCTIONS
// ==========================================

/**
 * Toggle login box visibility
 */
function toggleLoginBox() {
    console.log('🔄 Toggling login box');
    
    if (DOMElements.loginBox && DOMElements.loginLink) {
        const isHidden = DOMElements.loginBox.className === "login-hidden";
        DOMElements.loginBox.className = isHidden ? "login-display" : "login-hidden";
        DOMElements.loginLink.style.backgroundColor = isHidden ? "lightblue" : "lightgray";
        
        // Hide create account box
        if (DOMElements.createAccountBox && isHidden) {
            DOMElements.createAccountBox.className = "create-account-hidden";
            if (DOMElements.createAccountLink) {
                DOMElements.createAccountLink.style.backgroundColor = "lightgray";
            }
        }
        
        clearAllValidationErrors();
    }
}

/**
 * Toggle create account box visibility
 */
function toggleCreateAccountBox() {
    console.log('🔄 Toggling create account box');
    
    if (DOMElements.createAccountBox && DOMElements.createAccountLink) {
        const isHidden = DOMElements.createAccountBox.className === "create-account-hidden";
        DOMElements.createAccountBox.className = isHidden ? "create-account-display" : "create-account-hidden";
        DOMElements.createAccountLink.style.backgroundColor = isHidden ? "lightblue" : "lightgray";
        
        // Hide login box
        if (DOMElements.loginBox && isHidden) {
            DOMElements.loginBox.className = "login-hidden";
            if (DOMElements.loginLink) {
                DOMElements.loginLink.style.backgroundColor = "lightgray";
            }
        }
        
        clearAllValidationErrors();
    }
}

/**
 * Toggle sign-in/create account form
 */
function toggleSignInCreateForm() {
    console.log('🔄 Toggling sign-in create form');
    
    if (DOMElements.signInCreateForm) {
        const isHidden = DOMElements.signInCreateForm.className === "siginCreateAccount-hidden";
        DOMElements.signInCreateForm.className = isHidden ? "siginCreateAccount-display" : "siginCreateAccount-hidden";
        
        clearAllValidationErrors();
    }
}

/**
 * Hide all forms
 */
function hideAllForms() {
    console.log('🔄 Hiding all forms');
    
    if (DOMElements.loginBox) {
        DOMElements.loginBox.className = "login-hidden";
    }
    if (DOMElements.createAccountBox) {
        DOMElements.createAccountBox.className = "create-account-hidden";
    }
    if (DOMElements.signInCreateForm) {
        DOMElements.signInCreateForm.className = "siginCreateAccount-hidden";
    }
    
    // Reset link colors
    if (DOMElements.loginLink) {
        DOMElements.loginLink.style.backgroundColor = "lightgray";
    }
    if (DOMElements.createAccountLink) {
        DOMElements.createAccountLink.style.backgroundColor = "lightgray";
    }
    
    clearAllValidationErrors();
}

// ==========================================
// USERNAME AVAILABILITY CHECKING
// ==========================================

/**
 * Check username availability with debouncing
 */
const debouncedUsernameCheck = debounce((username) => {
    checkUsernameAvailabilityInternal(username);
}, 500);

/**
 * Check username availability (called on input change)
 */
function checkUsernameAvailability() {
    const username = DOMElements.createUsername?.value?.trim();
    
    if (!username) {
        hideValidationError('username-availability');
        return;
    }
    
    if (username.length < 3) {
        showValidationError('username-availability', 'Username must be at least 3 characters');
        return;
    }
    
    if (username.length > 100) { // UPDATED LIMIT
        showValidationError('username-availability', 'Username must be less than 100 characters');
        return;
    }
    
    // Updated regex to allow more characters for longer usernames
    if (!/^[a-zA-Z0-9_@.-]+$/.test(username)) {
        showValidationError('username-availability', 'Username can only contain letters, numbers, underscores, @ and periods');
        return;
    }
    
    // Show loading state
    const availabilityElement = document.getElementById('username-availability');
    if (availabilityElement) {
        availabilityElement.innerHTML = '⏳ Checking availability...';
        availabilityElement.style.color = 'orange';
        availabilityElement.style.display = 'block';
    }
    
    // Use debounced function
    debouncedUsernameCheck(username);
}

/**
 * Internal username availability check function
 */
async function checkUsernameAvailabilityInternal(username) {
    console.log('🔍 Checking username availability for:', username);
    
    try {
        const url = `${AppConfig.server.auth.url}${AppConfig.server.auth.endpoints.checkUsername}?username=${encodeURIComponent(username)}`;
        console.log('📤 Request URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        console.log('📥 Username availability response:', data);
        
        const availabilityElement = document.getElementById('username-availability');
        if (!availabilityElement) return;
        
        if (response.ok && data.success) {
            availabilityElement.style.display = 'block';
            if (data.available) {
                availabilityElement.style.color = 'green';
                availabilityElement.innerHTML = '✅ Username is available';
            } else {
                availabilityElement.style.color = 'red';
                availabilityElement.innerHTML = '❌ Username is unavailable';
            }
        } else {
            showValidationError('username-availability', data.message || 'Error checking availability');
        }
    } catch (error) {
        console.error('💥 Username availability check failed:', error);
        showValidationError('username-availability', 'Network error: Unable to check availability');
    }
}

// ==========================================
// FORM VALIDATION
// ==========================================

/**
 * Validate login inputs - UPDATED FOR LONGER USERNAMES
 */
function validateLoginInputs() {
    let isValid = true;
    
    const username = DOMElements.loginUsername?.value?.trim();
    const password = DOMElements.loginPassword?.value;
    
    // Validate username - UPDATED LIMITS
    if (!username) {
        showValidationError('login-username-validation', 'Please enter your username');
        isValid = false;
    } else if (username.length > 100) { // ADDED LENGTH CHECK
        showValidationError('login-username-validation', 'Username is too long');
        isValid = false;
    } else {
        hideValidationError('login-username-validation');
    }
    
    // Validate password
    if (!password) {
        showValidationError('login-password-validation', 'Please enter your password');
        isValid = false;
    } else {
        hideValidationError('login-password-validation');
    }
    
    return isValid;
}

/**
 * Validate registration inputs
 */
function validateRegistrationInputs() {
    console.log('🔍 Validating registration inputs');
    
    let isValid = true;
    
    const name = DOMElements.createName?.value?.trim();
    const username = DOMElements.createUsername?.value?.trim();
    const email = DOMElements.createEmail?.value?.trim();
    const password = DOMElements.createPassword?.value;
    const confirmPassword = DOMElements.confirmCreatePassword?.value;
    
    // Validate name
    if (!name) {
        showValidationError('create-name-validation', 'Please enter your full name');
        isValid = false;
    } else if (name.length < 2) {
        showValidationError('create-name-validation', 'Name must be at least 2 characters');
        isValid = false;
    } else {
        hideValidationError('create-name-validation');
    }
    
    // Validate username - UPDATED LIMITS
    if (!username) {
        showValidationError('username-availability', 'Please enter a username');
        isValid = false;
    } else if (username.length < 3) {
        showValidationError('username-availability', 'Username must be at least 3 characters');
        isValid = false;
    } else if (username.length > 100) { // CHANGED FROM 20 TO 100
        showValidationError('username-availability', 'Username must be less than 100 characters');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_@.-]+$/.test(username)) { // ALSO ALLOWING @ AND . FOR EMAIL-LIKE USERNAMES
        showValidationError('username-availability', 'Username can only contain letters, numbers, underscores, @ and periods');
        isValid = false;
    } else {
        // Check if username availability was already checked
        const availabilityElement = document.getElementById('username-availability');
        if (availabilityElement && availabilityElement.style.color !== 'green') {
            showValidationError('username-availability', 'Please check username availability first');
            isValid = false;
        }
    }
    
    // Validate email
    if (!email) {
        showValidationError('create-email-validation', 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showValidationError('create-email-validation', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideValidationError('create-email-validation');
    }
    
    // Validate passwords
    if (!password) {
        showValidationError('confirm-password-validation', 'Please enter a password');
        isValid = false;
    } else if (password.length < 6) {
        showValidationError('confirm-password-validation', 'Password must be at least 6 characters');
        isValid = false;
    } else if (!confirmPassword) {
        showValidationError('confirm-password-validation', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showValidationError('confirm-password-validation', 'Passwords do not match');
        isValid = false;
    } else {
        hideValidationError('confirm-password-validation');
    }
    
    console.log('📊 Validation result:', isValid);
    return isValid;
}

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================

/**
 * User login/signin function
 */
async function authenticateUser() {
    console.log('🔍 authenticateUser() function called');
    
    // Prevent double submissions
    if (AppState.isSubmitting) {
        console.log('⏳ Already submitting, ignoring duplicate call');
        return;
    }
    
    // Validate inputs
    if (!validateLoginInputs()) {
        console.log('❌ Login validation failed');
        return;
    }
    
    AppState.isSubmitting = true;
    
    // Update button state
    const loginButton = DOMElements.loginButton || document.querySelector('button[onclick="authenticateUser()"]');
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.textContent = 'Signing In...';
        loginButton.style.opacity = '0.6';
    }
    
    try {
        const username = DOMElements.loginUsername.value.trim();
        const password = DOMElements.loginPassword.value;
        
        console.log('📤 Sending login request for user:', username);
        
        const response = await fetch(`${AppConfig.server.auth.url}${AppConfig.server.auth.endpoints.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const result = await response.json();
        console.log('📥 Login response:', result);
        
        if (response.ok && result.success) {
            handleSuccessfulLogin(result);
        } else {
            handleFailedLogin(result.message || 'Invalid credentials');
        }
        
    } catch (error) {
        console.error('💥 Login request failed:', error);
        handleFailedLogin('Network error: Unable to connect to server');
    } finally {
        // Reset button state
        AppState.isSubmitting = false;
        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';
            loginButton.style.opacity = '1';
        }
    }
}

/**
 * Handle successful login
 */
function handleSuccessfulLogin(result) {
    console.log('✅ Login successful:', result);
    
    AppState.loginState = true;
    AppState.currentUser = result.data;
    
    showAuthMessage('Login Successful! 🎉', 'green', 'login-message');
    
    // Clear login form
    if (DOMElements.loginUsername) DOMElements.loginUsername.value = '';
    if (DOMElements.loginPassword) DOMElements.loginPassword.value = '';
    
    // Update user profile
    setTimeout(() => {
        hideAllForms();
        updateUserProfile(result.data);
    }, 2000);
}

/**
 * Handle failed login
 */
function handleFailedLogin(message) {
    console.log('❌ Login failed:', message);
    showAuthMessage(message, 'red', 'login-message');
}

/**
 * Update user profile display
 */
function updateUserProfile(userData) {
    console.log('👤 Updating user profile:', userData);
    
    if (DOMElements.usernameDisplay) {
        DOMElements.usernameDisplay.innerHTML = userData.username || 'Unknown';
    }
    if (DOMElements.racesDisplay) {
        DOMElements.racesDisplay.innerHTML = `${userData.races || 0} races`;
    }
    if (DOMElements.averageDisplay) {
        DOMElements.averageDisplay.innerHTML = `${userData.speed || 0} wpm`;
    }
    
    // Show user profile section if it exists
    if (DOMElements.userProfile) {
        DOMElements.userProfile.style.display = 'block';
    }
}

// ==========================================
// USER REGISTRATION FUNCTIONS
// ==========================================

/**
 * Create new user account
 */
async function addUser() {
    console.log('🔍 addUser() function called');
    
    // Prevent double submissions
    if (AppState.isSubmitting) {
        console.log('⏳ Already submitting, ignoring duplicate call');
        return;
    }
    
    // Validate inputs
    if (!validateRegistrationInputs()) {
        console.log('❌ Registration validation failed');
        return;
    }
    
    AppState.isSubmitting = true;
    
    // Update button state
    const submitButton = DOMElements.createAccountSubmit || document.querySelector('button[onclick="addUser()"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        submitButton.style.opacity = '0.6';
    }
    
    try {
        const userData = {
            name: DOMElements.createName.value.trim(),
            username: DOMElements.createUsername.value.trim(),
            email: DOMElements.createEmail.value.trim(),
            password: DOMElements.createPassword.value,
        };
        
        console.log('📤 Sending registration request:', {
            ...userData,
            password: '[HIDDEN]'
        });
        
        const response = await fetch(`${AppConfig.server.auth.url}${AppConfig.server.auth.endpoints.signup}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const result = await response.json();
        console.log('📥 Registration response:', result);
        
        if (response.ok && result.success) {
            handleSuccessfulRegistration(result);
        } else {
            handleFailedRegistration(result.message || 'Registration failed');
        }
        
    } catch (error) {
        console.error('💥 Registration request failed:', error);
        handleFailedRegistration('Network error: Unable to connect to server');
    } finally {
        // Reset button state
        AppState.isSubmitting = false;
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
            submitButton.style.opacity = '1';
        }
    }
}

/**
 * Handle successful registration
 */
function handleSuccessfulRegistration(result) {
    console.log('✅ Registration successful:', result);
    
    showAuthMessage('Account created successfully! 🎉 Please sign in with your new account.', 'green', 'create-account-message');
    
    // Clear registration form
    clearRegistrationForm();
    
    // Switch to login tab after 3 seconds
    setTimeout(() => {
        toggleLoginBox();
    }, 3000);
}

/**
 * Handle failed registration
 */
function handleFailedRegistration(message) {
    console.log('❌ Registration failed:', message);
    showAuthMessage(message, 'red', 'create-account-message');
}

/**
 * Clear registration form
 */
function clearRegistrationForm() {
    const fields = [
        DOMElements.createName,
        DOMElements.createUsername,
        DOMElements.createEmail,
        DOMElements.createPassword,
        DOMElements.confirmCreatePassword
    ];
    
    fields.forEach(field => {
        if (field) field.value = '';
    });
    
    clearAllValidationErrors();
}

// ==========================================
// USER LOGOUT
// ==========================================

/**
 * Logout user
 */
function logoutUser() {
    console.log('🚪 Logging out user');
    
    AppState.loginState = false;
    AppState.currentUser = null;
    
    // Reset user profile display
    if (DOMElements.usernameDisplay) DOMElements.usernameDisplay.innerHTML = 'Guest';
    if (DOMElements.racesDisplay) DOMElements.racesDisplay.innerHTML = '0 races';
    if (DOMElements.averageDisplay) DOMElements.averageDisplay.innerHTML = '0 wpm';
    
    // Hide user profile
    if (DOMElements.userProfile) {
        DOMElements.userProfile.style.display = 'none';
    }
    
    // Clear any messages
    clearAllValidationErrors();
    
    console.log('✅ User logged out successfully');
}

// ==========================================
// EVENT LISTENERS AND INITIALIZATION
// ==========================================

/**
 * Initialize form functionality
 */
function initializeForm() {
    console.log('🚀 Initializing form functionality');
    
    // Add event listeners for navigation
    if (DOMElements.loginLink) {
        DOMElements.loginLink.addEventListener('click', toggleLoginBox);
    }
    if (DOMElements.createAccountLink) {
        DOMElements.createAccountLink.addEventListener('click', toggleCreateAccountBox);
    }
    if (DOMElements.signInCreateButton) {
        DOMElements.signInCreateButton.addEventListener('click', toggleSignInCreateForm);
    }
    
    // Add event listener for username input (real-time checking)
    if (DOMElements.createUsername) {
        DOMElements.createUsername.addEventListener('input', checkUsernameAvailability);
    }
    
    // Add form submission prevention
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            return false;
        });
    });
    
    // Add Enter key support for login
    if (DOMElements.loginPassword) {
        DOMElements.loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                authenticateUser();
            }
        });
    }
    
    console.log('✅ Form initialization complete');
}

// ==========================================
// TESTING AND DEBUGGING
// ==========================================

/**
 * Test function for debugging
 */
function testButtonClick() {
    console.log('🧪 Test button clicked - JavaScript is working!');
    alert('Test button is working!');
}

/**
 * Debug function to check all functionality
 */
function debugForm() {
    console.log('🔍 Form Debug Report');
    console.log('===================');
    
    console.log('📋 Available Functions:');
    console.log('  - authenticateUser:', typeof authenticateUser);
    console.log('  - addUser:', typeof addUser);
    console.log('  - checkUsernameAvailability:', typeof checkUsernameAvailability);
    console.log('  - toggleLoginBox:', typeof toggleLoginBox);
    console.log('  - toggleCreateAccountBox:', typeof toggleCreateAccountBox);
    
    console.log('\n📱 DOM Elements:');
    Object.entries(DOMElements).forEach(([key, element]) => {
        console.log(`  - ${key}:`, element ? '✅ Found' : '❌ Missing');
    });
    
    console.log('\n⚙️ Configuration:');
    if (window.AppConfig) {
        console.log('  - Server URL:', window.AppConfig.server?.auth?.url);
        console.log('  - Endpoints:', window.AppConfig.server?.auth?.endpoints);
    } else {
        console.log('  - ❌ AppConfig not loaded');
    }
    
    console.log('\n📊 Current State:');
    console.log('  - Login State:', AppState.loginState);
    console.log('  - Is Submitting:', AppState.isSubmitting);
    console.log('  - Current User:', AppState.currentUser);
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions globally available for HTML onclick handlers
window.authenticateUser = authenticateUser;
window.addUser = addUser;
window.checkUsernameAvailability = checkUsernameAvailability;
window.toggleLoginBox = toggleLoginBox;
window.toggleCreateAccountBox = toggleCreateAccountBox;
window.toggleSignInCreateForm = toggleSignInCreateForm;
window.logoutUser = logoutUser;
window.testButtonClick = testButtonClick;
window.debugForm = debugForm;

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing form functionality');
    
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        initializeForm();
        
        // Debug info
        console.log('✅ Form.js fully loaded and initialized');
        console.log('🔧 Run debugForm() in console for detailed info');
    }, 100);
});
