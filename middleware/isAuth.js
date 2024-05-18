const jwt = require('jsonwebtoken')

const isAuth = ((req,res,next)=>{
    const token = req.cookies.token
    
    if(!token){
        return res.status(401).json({ message: 'Token not found' });
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    if(!decoded){
        throw new Error("Invalid Token")
    }
    req.user = decoded
    console.log(req.user.username);
    next();
})

module.exports = isAuth