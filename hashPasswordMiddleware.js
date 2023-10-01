const bcrypt = require("bcryptjs");

const hashPasswordMiddleware = async(req,res,next)=>{
    try{
        const {password} = req.body;
        const rounds = 10;
        const hashedPassword = await bcrypt.hash(password,rounds);
        req.body.password = hashedPassword;
        next();
    }
    catch(error){
        console.log(`Error hashing passowrd`,error);
        res.status(500).json({error:'Internal Server Error'});
    }
};

module.exports = hashPasswordMiddleware;