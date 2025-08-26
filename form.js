/**
 * ChimpanzeType - Form Handling Script
 * Handles login/signup modal functionality and user authentication
 */

// ==========================================
// GLOBAL VARIABLES
// ==========================================
window.loginState = false;

// DOM Elements
let loginBox = null;
let createAccountBox = null;
let siginCreateForm = null;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeFormElements();
    setupEventListeners();
});

/**
 * Initialize DOM element references
 */
function initializeFormElements() {
    loginBox = document.getElementById('login-box');
    createAccountBox = document.getElementById('create-account-box');
    siginCreateForm = document.getElementById('sigin-createaccount-form');
}

/**
 * Set up all event listeners for form interactions
 */
function setupEventListeners() {
    // Login/Create Account button
    const signInButton = document.getElementById('signin-createaccount-button');
    if (signInButton) {
        signInButton.addEventListener('click', toggleAuthModal);
    }

    // Login link
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', toggleLoginSection);
    }

    // Create Account link  
    const createAccountLink = document.getElementById('create-account-link');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', toggleCreateAccountSection);
    }
}

// ==========================================
// MODAL TOGGLE FUNCTIONS
// ==========================================

/**
 * Toggles the main authentication modal
 */
function toggleAuthModal() {
    if (siginCreateForm.className === 'siginCreateAccount-hidden') {
        siginCreateForm.className = 'siginCreateAccount-display';
    } else {
        siginCreateForm.className = 'siginCreateAccount-hidden';
    }
}

/**
 * Toggles the login section visibility
 */
function toggleLoginSection() {
    const loginLink = document.getElementById('login-link');
    
    if (loginBox.className === 'login-hidden') {
        loginBox.className = 'login-display';
        loginLink.style.backgroundColor = 'lightblue';
    } else {
        loginBox.className = 'login-hidden';
        loginLink.style.backgroundColor = 'lightgray';
    }
}

/**
 * Toggles the create account section visibility
 */
function toggleCreateAccountSection() {
    const createAccountLink = document.getElementById('create-account-link');
    
    if (createAccountBox.className === 'create-account-hidden') {
        createAccountBox.className = 'create-account-display';
        createAccountLink.style.backgroundColor = 'lightblue';
    } else {
        createAccountBox.className = 'create-account-hidden';
        createAccountLink.style.backgroundColor = 'lightgray';
    }
}

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================

/**
 * Authenticates user login
 */
function authenticateUser() {
    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');
    
    // Validate inputs
    if (!validateLoginInputs(username, password)) {
        return;
    }

    // Prepare login data
    const loginData = {
        username: username.value,
        password: password.value
    };

    // Send login request
    fetch('http://127.0.0.1:5501/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(async function(response) {
        if (response.ok) {
            handleSuccessfulLogin(await response.json());
        } else if (response.status === 401) {
            handleFailedLogin();
        }
    })
    .catch(function(error) {
        console.error('Login error:', error);
        showAuthMessage('An error occurred during login', 'red');
    });
}

/**
 * Validates login form inputs
 * @param {HTMLElement} username - Username input element
 * @param {HTMLElement} password - Password input element
 * @returns {boolean} - True if inputs are valid
 */
function validateLoginInputs(username, password) {
    const usernameValidation = document.getElementById('login-username-validation');
    const passwordValidation = document.getElementById('login-password-validation');
    
    // Reset validation messages
    hideValidationMessage(usernameValidation);
    hideValidationMessage(passwordValidation);
    
    let isValid = true;
    
    if (username.value.trim() === '') {
        showValidationMessage(usernameValidation, 'Please Enter Username');
        isValid = false;
    }
    
    if (password.value.trim() === '') {
        showValidationMessage(passwordValidation, 'Please Enter Password');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handles successful login response
 * @param {Object} response - Login response data
 */
function handleSuccessfulLogin(response) {
    showAuthMessage('Login Successful', 'green');
    
    // Clear form inputs
    clearElement('login-username');
    clearElement('login-password');
    
    // Update user info and close modal after delay
    setTimeout(() => {
        closeAuthModal();
        updateUserInfo(response.data);
    }, 2000);
}

/**
 * Handles failed login attempt
 */
function handleFailedLogin() {
    showAuthMessage('Invalid Credentials', 'red');
}

/**
 * Updates user information in the UI
 * @param {Object} userData - User data from server
 */
function updateUserInfo(userData) {
    const usernameElement = document.getElementById('username');
    const racesElement = document.getElementById('races');
    const averageElement = document.getElementById('average');
    
    if (usernameElement) usernameElement.textContent = userData.username;
    if (racesElement) racesElement.textContent = `${userData.races} races`;
    if (averageElement) averageElement.textContent = `${userData.speed} wpm`;
}

/**
 * Closes the authentication modal
 */
function closeAuthModal() {
    loginBox.className = 'login-hidden';
    createAccountBox.className = 'create-account-hidden';
    siginCreateForm.className = 'siginCreateAccount-hidden';
}

// ==========================================
// USER REGISTRATION FUNCTIONS
// ==========================================

/**
 * Validates and creates a new user account
 */
function addUser() {
    const formData = getRegistrationFormData();
    
    // Validate all inputs
    if (!validateRegistrationInputs(formData)) {
        return;
    }

    // Prepare user data
    const userData = {
        name: formData.name.value,
        username: formData.username.value,
        email: formData.email.value,
        password: formData.password.value,
    };

    // Send registration request
    fetch('http://127.0.0.1:5502/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(res => res.json())
    .then(response => {
        handleRegistrationResponse(response);
    })
    .catch(error => {
        console.error('Registration error:', error);
    })
    .finally(() => {
        clearRegistrationForm(formData);
    });
}

/**
 * Gets all form data for registration
 * @returns {Object} Form elements
 */
function getRegistrationFormData() {
    return {
        name: document.getElementById('create-name'),
        username: document.getElementById('create-username'),
        email: document.getElementById('create-email'),
        password: document.getElementById('create-password'),
        confirmPassword: document.getElementById('confirm-create-password')
    };
}

/**
 * Validates all registration inputs
 * @param {Object} formData - Form elements
 * @returns {boolean} - True if all inputs are valid
 */
function validateRegistrationInputs(formData) {
    return validatingName(formData.name.value) &&
           validateEmail(formData.email.value) &&
           validateUsername(formData.username.value) &&
           validatePassword(formData.password.value, formData.confirmPassword.value);
}

/**
 * Handles registration response
 * @param {Object} response - Server response
 */
function handleRegistrationResponse(response) {
    // Handle response based on server implementation
    console.log('Registration response:', response);
}

/**
 * Clears registration form fields
 * @param {Object} formData - Form elements
 */
function clearRegistrationForm(formData) {
    formData.name.value = '';
    formData.username.value = '';
    formData.email.value = '';
    formData.password.value = '';
    formData.confirmPassword.value = '';
}

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validates name input
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
function validatingName(name) {
    const nameValidation = document.getElementById('create-name-validation');
    
    if (name.trim() === '') {
        showValidationMessage(nameValidation, 'Please enter a name');
        return false;
    }
    
    hideValidationMessage(nameValidation);
    return true;
}

/**
 * Validates username input
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
function validateUsername(username) {
    const usernameValidation = document.getElementById('username-availability');
    
    if (username.trim() === '') {
        showValidationMessage(usernameValidation, 'Please enter a username');
        return false;
    }
    
    hideValidationMessage(usernameValidation);
    return true;
}

/**
 * Validates email input
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
    const emailValidation = document.getElementById('create-email-validation');
    
    if (email.trim() === '') {
        showValidationMessage(emailValidation, 'Please enter an email');
        return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showValidationMessage(emailValidation, 'Please enter a valid email');
        return false;
    }
    
    hideValidationMessage(emailValidation);
    return true;
}

/**
 * Validates password and confirmation
 * @param {string} password - Password to validate
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} - True if valid
 */
function validatePassword(password, confirmPassword) {
    const confirmPasswordValidation = document.getElementById('confirm-password-validation');
    
    if (password.trim() === '') {
        showValidationMessage(confirmPasswordValidation, 'Please enter the password');
        return false;
    }
    
    if (confirmPassword.trim() === '') {
        showValidationMessage(confirmPasswordValidation, 'Please confirm the entered password');
        return false;
    }
    
    if (password !== confirmPassword) {
        showValidationMessage(confirmPasswordValidation, 'Passwords do not match');
        return false;
    }
    
    hideValidationMessage(confirmPasswordValidation);
    return true;
}

/**
 * Checks username availability
 */
function checkUsernameAvailability() {
    const username = document.getElementById('create-username').value;
    const availabilityElement = document.getElementById('username-availability');
    
    if (username.trim() === '') {
        showValidationMessage(availabilityElement, 'Please enter a username first');
        return;
    }
    
    fetch(`http://127.0.0.1:5502/checkAvailability?username=${username}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            availabilityElement.style.display = 'block';
            availabilityElement.style.color = 'green';
            availabilityElement.textContent = 'Username is available';
        } else {
            availabilityElement.style.display = 'block';
            availabilityElement.style.color = 'red';
            availabilityElement.textContent = 'Username is unavailable';
        }
    })
    .catch(error => {
        console.error('Username availability check failed:', error);
        showValidationMessage(availabilityElement, 'Error checking availability');
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Shows a validation message
 * @param {HTMLElement} element - Element to show message in
 * @param {string} message - Message to show
 */
function showValidationMessage(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

/**
 * Hides a validation message
 * @param {HTMLElement} element - Element to hide
 */
function hideValidationMessage(element) {
    if (element) {
        element.style.display = 'none';
        element.textContent = '';
    }
}

/**
 * Shows authentication message
 * @param {string} message - Message to show
 * @param {string} color - Color of the message
 */
function showAuthMessage(message, color) {
    const authMessage = document.getElementById('auth-message');
    if (authMessage) {
        authMessage.innerHTML = `<p style="color: ${color};">${message}</p>`;
    }
}

/**
 * Clears an element's content
 * @param {string} elementId - ID of element to clear
 */
function clearElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = '';
    }
}
