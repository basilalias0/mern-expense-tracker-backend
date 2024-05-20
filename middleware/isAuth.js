const jwt = require('jsonwebtoken')

const isAuth = ((req,res,next)=>{
    const headerObj = req.headers
    

    const token = headerObj?.authorization?.split(' ')[1]
    
    if(!token){
        return res.status(401).json({ message: 'Token not found' });
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    if(!decoded){
        throw new Error("Invalid Token")
    }
    console.log(decoded);
    req.user = decoded
    console.log(req.user.username);
    next();
})

module.exports = isAuth