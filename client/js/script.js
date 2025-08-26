/**
 * ChimpanzeType - Typing Speed Test Application
 * Main script for handling typing game functionality
 */

// ==========================================
// GLOBAL VARIABLES
// ==========================================
let charIndex = 0;
let currentMessage = '';
let startTime = 0;
let inAccuracyCount = 0;
let elapsedTime = 0;

// DOM Elements
const content = document.getElementById('content');
const currentWord = document.getElementById('current-word');
const message = document.getElementById('message');

// ==========================================
// TYPING GAME FUNCTIONS
// ==========================================

/**
 * Handles backspace and delete key events
 * @param {Event} event - Keyboard event
 */
function handleBackspace(event) {
    const key = event.key;
    if (key === 'Backspace' || key === 'Delete') {
        if (content.childNodes[charIndex]) {
            content.childNodes[charIndex].className = '';
        }
        if (charIndex > 0) {
            charIndex--;
        }
        if (content.childNodes[charIndex]) {
            content.childNodes[charIndex].className = 'highlight';
        }
    }
}

/**
 * Handles user input and updates the typing progress
 */
function handleInput() {
    const typedValue = currentWord.value;
    
    // Check if we've reached the end of the message
    if (charIndex === currentMessage.length - 1) {
        finishTypingTest();
        return;
    }
    
    // Check if the typed character matches the expected character
    if (typedValue === currentMessage[charIndex]) {
        handleCorreectCharacter();
    } else {
        handleIncorrectCharacter();
    }
}

/**
 * Handles correct character input
 */
function handleCorreectCharacter() {
    if (content.childNodes[charIndex]) {
        content.childNodes[charIndex].className = 'done';
    }
    currentWord.value = '';
    charIndex++;
    
    if (content.childNodes[charIndex]) {
        content.childNodes[charIndex].className = 'highlight';
    }
}

/**
 * Handles incorrect character input
 */
function handleIncorrectCharacter() {
    inAccuracyCount++;
    if (content.childNodes[charIndex]) {
        content.childNodes[charIndex].className = 'error';
    }
    currentWord.value = '';
    charIndex++;
}

/**
 * Finishes the typing test and displays results
 */
function finishTypingTest() {
    content.innerHTML = '';
    currentWord.value = '';
    
    elapsedTime = (new Date().getTime() - startTime) / 60000; // Convert to minutes
    const wpm = Math.round((currentMessage.length / 5) / elapsedTime);
    const accuracy = Math.round(((currentMessage.length - inAccuracyCount) / currentMessage.length) * 100);
    
    const resultHTML = `
        <div class="result">
            <h3>Test Complete!</h3>
            <p>Speed: ${wpm} words per minute</p>
            <p>Accuracy: ${accuracy}%</p>
            <p>Errors: ${inAccuracyCount}</p>
        </div>
    `;
    
    content.innerHTML = resultHTML;
    charIndex = 0;
    
    // Remove event listeners
    removeEventListeners();
}

/**
 * Prepares text content for typing by wrapping each character in spans
 * @param {string} text - The text to prepare
 * @returns {string} HTML string with characters wrapped in spans
 */
function prepareTextContent(text) {
    const words = text.split(' ');
    const spanWords = words.map(word => {
        const spanCharacters = word.split('').map(char => `<span>${char}</span>`);
        return spanCharacters.join('');
    });
    return spanWords.join(' ');
}

/**
 * Initializes the typing test with new content
 * @param {string} text - The text to type
 */
function initializeTypingTest(text) {
    // Reset variables
    charIndex = 0;
    inAccuracyCount = 0;
    currentMessage = text;
    
    // Prepare and display content
    content.innerHTML = prepareTextContent(text);
    
    // Reset all character classes
    for (const element of content.childNodes) {
        element.className = '';
    }
    
    // Highlight first character
    if (content.childNodes[0]) {
        content.childNodes[0].className = 'highlight';
    }
    
    // Reset UI elements
    if (message) {
        message.innerText = '';
    }
    currentWord.value = '';
    
    // Record start time
    startTime = new Date().getTime();
    
    // Add event listeners
    addEventListeners();
}

/**
 * Adds event listeners for typing functionality
 */
function addEventListeners() {
    currentWord.addEventListener('keydown', handleBackspace);
    currentWord.addEventListener('input', handleInput);
}

/**
 * Removes event listeners
 */
function removeEventListeners() {
    currentWord.removeEventListener('keydown', handleBackspace);
    currentWord.removeEventListener('input', handleInput);
}

/**
 * Fetches a random quote from the API and starts the typing test
 */
function startTypingTest() {
    $.ajax({
        method: 'GET',
        url: AppConfig.api.quotes.url,
        headers: { 'X-Api-Key': 'hgLdefTld20KuS/1sYoL6w==Kvdoxvt71AoQWKz1' }, // TODO: Move to backend
        contentType: 'application/json',
        cache: false,
        success: function(result) {
            if (result && result[0] && result[0].quote) {
                initializeTypingTest(result[0].quote);
            } else {
                useFallbackText();
            }
        },
        error: function(xhr, status, error) {
            console.warn('API request failed, using fallback text:', error);
            useFallbackText();
        }
    });
}

/**
 * Uses a random fallback text when API is unavailable
 */
function useFallbackText() {
    const fallbackTexts = AppConfig.api.quotes.fallbackTexts;
    const randomIndex = Math.floor(Math.random() * fallbackTexts.length);
    initializeTypingTest(fallbackTexts[randomIndex]);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    if (startButton) {
        startButton.addEventListener('click', startTypingTest);
    }
});
