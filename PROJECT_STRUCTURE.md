# ChimpanzeType Project Structure

## Current Structure (After Cleanup)

```
chimpanzetype/
├── client/                          # Frontend files
│   ├── assets/
│   │   └── icons/                   # App icons and favicons
│   │       ├── favicon.svg
│   │       ├── favicon-16x16.png
│   │       ├── favicon-32x32.png
│   │       ├── apple-touch-icon.png
│   │       └── site.webmanifest
│   ├── css/
│   │   ├── style.css               # Main styles
│   │   ├── header.css              # Header component styles
│   │   └── responsive.css          # Responsive design
│   ├── js/
│   │   ├── config.js               # App configuration
│   │   ├── form.js                 # Form handling and auth
│   │   └── typing-test.js          # Typing test logic
│   └── index.html                  # Main HTML file
├── server/                          # Backend files
│   ├── auth-server.js              # ✅ UNIFIED authentication server
│   ├── database.js                 # Database connection and queries
│   ├── hashPasswordMiddleware.js   # Password hashing middleware
│   └── middleware/                 # Additional middleware
├── scripts/                        # Utility scripts
│   ├── generate-favicons.js        # Favicon generation
│   └── cleanup.js                  # Project cleanup
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project documentation
```

## Removed Files (No Longer Needed)

- ❌ `server/CreateAccount.js` - Merged into auth-server.js
- ❌ `server/Login.js` - Merged into auth-server.js (if existed)
- ❌ Any other separate auth endpoints

## Key Points

1. **Single Server**: All authentication is now handled by `auth-server.js`
2. **Unified Port**: Everything runs on port 5500
3. **Clean Structure**: No duplicate or conflicting files
4. **Maintainable**: Single source of truth for authentication logic
```