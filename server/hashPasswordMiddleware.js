const bcrypt = require('bcryptjs');

const hashPasswordMiddleware = async (req, res, next) => {
    console.log('🔍 Password hashing middleware called');
    console.log('📝 Original password length:', req.body.password?.length);
    
    try {
        if (req.body.password) {
            const saltRounds = 10;
            console.log('🔐 Hashing password with salt rounds:', saltRounds);
            
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
            
            console.log('✅ Password hashed successfully');
            console.log('📝 Hashed password length:', hashedPassword.length);
        } else {
            console.log('❌ No password found in request body');
        }
        
        next();
    } catch (error) {
        console.error('💥 Password hashing error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password'
        });
    }
};

module.exports = hashPasswordMiddleware;