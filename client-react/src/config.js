/**
 * Application Configuration
 */

const config = {
    // API Configuration
    api: {
        quotes: {
            url: 'https://api.api-ninjas.com/v1/quotes/',
            fallbackTexts: [
                "The quick brown fox jumps over the lazy dog. This is a typing test to measure your speed and accuracy. Practice makes perfect when you keep typing consistently every day.",
                "In today's digital world, typing skills are essential for productivity and communication. The more you practice, the faster and more accurate you will become at typing.",
                "Consistency is the key to improving your typing speed and accuracy. Regular daily practice will help you develop muscle memory and increase your words per minute.",
                "Good typing technique involves proper finger placement, maintaining rhythm, and avoiding the hunt-and-peck method. Focus on accuracy first, then speed will naturally follow.",
                "Professional typists can achieve speeds of over one hundred words per minute through dedicated practice and proper technique. Set goals and track your progress regularly."
            ]
        }
    },
    
    // Server Configuration
    server: {
        auth: {
            url: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5500',
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
    }
};

export default config;
