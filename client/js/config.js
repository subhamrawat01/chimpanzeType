/**
 * Application Configuration
 * Contains application-wide configuration settings
 */

const config = {
    // API Configuration
    api: {
        quotes: {
            url: 'https://api.api-ninjas.com/v1/quotes/',
            // Note: In production, this should be handled by a backend endpoint
            // to keep the API key secure
            fallbackTexts: [
                "The quick brown fox jumps over the lazy dog. This is a typing test to measure your speed and accuracy.",
                "Practice makes perfect. The more you type, the faster and more accurate you will become.",
                "Good typing skills are essential in today's digital world where most communication happens through keyboards.",
                "Consistency is key to improving your typing speed. Regular practice will help you develop muscle memory."
            ]
        }
    },
    
    // Server Configuration
    server: {
        auth: {
            url: 'http://127.0.0.1:5500',  // ✅ Single server
            endpoints: {
                login: '/auth/login',
                signup: '/auth/signup',
                checkUsername: '/auth/check-username'
            }
        }
    },
    
    // Game Configuration
    game: {
        defaultSettings: {
            minWords: 10,
            maxWords: 50,
            timeLimit: 60 // seconds
        }
    },
    
    // UI Configuration
    ui: {
        themes: {
            default: 'light',
            available: ['light', 'dark']
        },
        animations: {
            enabled: true,
            duration: 300 // milliseconds
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.AppConfig = config;
}