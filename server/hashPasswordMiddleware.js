const bcrypt = require('bcryptjs');

const hashPasswordMiddleware = async (req, res, next) => {
    
    try {
        if (req.body.password) {
            const saltRounds = 10;
            
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
        } else {
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing password'
        });
    }
};

module.exports = hashPasswordMiddleware;