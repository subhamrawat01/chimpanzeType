# ChimpanzeType

A modern, well-structured typing speed test application with user authentication and progress tracking.

## Features

- 🎯 Real-time typing speed test with quotes from API
- 👤 User authentication (login/signup)
- 📊 Progress tracking (WPM, accuracy, race count)
- 🎨 Clean, responsive user interface
- 🔒 Secure password hashing
- 📱 Mobile-friendly design

## Project Structure

```
chimpanzeType/
├── client/                 # Frontend files
│   ├── css/               # Stylesheets
│   │   ├── style.css      # Main styles
│   │   └── form.css       # Form-specific styles
│   ├── js/                # JavaScript files
│   │   ├── script.js      # Typing game logic
│   │   └── form.js        # Authentication forms
│   ├── assets/            # Static assets (images, etc.)
│   └── index.html         # Main HTML file
├── server/                # Backend files
│   ├── auth-server.js     # Authentication server
│   ├── CreateAccount.js   # Registration server
│   ├── database.js        # Database operations
│   ├── databasepg.js      # Legacy database file
│   └── hashPasswordMiddleware.js # Password hashing middleware
├── .env.example           # Environment variables template
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subhamrawat01/chimpanzeType.git
   cd chimpanzeType
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Set up the database**
   ```sql
   CREATE DATABASE ChimpanzeeType;
   
   -- Create users table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       username VARCHAR(50) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       name VARCHAR(100) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       speed integer DEFAULT 0,
       races integer DEFAULT 0
   );
   -- Create userdata table
   CREATE TABLE userdata (
       id SERIAL PRIMARY KEY,
       username VARCHAR(50) REFERENCES users(username),
       speed INTEGER DEFAULT 0,
       races INTEGER DEFAULT 0,
       accuracy DECIMAL(5,2) DEFAULT 0.00,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the application**
   ```bash
   # Development mode (both servers)
   npm run dev
   
   # Or start individual servers
   npm run server:auth      # Authentication server (port 5501)
   npm run server:register  # Registration server (port 5502)
   ```

6. **Access the application**
   - Open `client/index.html` in your browser
   - Or serve it through a local web server

## API Endpoints

### Authentication Server (Port 5501)
- `POST /login` - User authentication
- `GET /health` - Health check

### Registration Server (Port 5502)
- `POST /signup` - User registration
- `GET /checkAvailability?username=<username>` - Check username availability
- `GET /health` - Health check

## Technologies Used

### Frontend
- HTML5 with semantic structure
- CSS3 with responsive design
- Vanilla JavaScript (ES6+)
- jQuery for AJAX requests

### Backend
- Node.js with Express.js
- PostgreSQL database
- bcryptjs for password hashing
- CORS for cross-origin requests
- dotenv for environment variables

## Development

### Code Structure
- **Modular Architecture**: Clear separation between client and server code
- **Clean Code**: Well-documented functions with JSDoc comments
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Parameterized queries to prevent SQL injection
- **Responsive Design**: Mobile-first CSS approach

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Future Enhancements

- [ ] JWT token-based authentication
- [ ] Real-time multiplayer racing
- [ ] Detailed statistics and analytics
- [ ] Custom text imports
- [ ] Themes and customization options
- [ ] Social features and leaderboards
