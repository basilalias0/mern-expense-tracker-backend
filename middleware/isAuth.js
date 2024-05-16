const jwt = require('jsonwebtoken')

const isAuth = ((req,res,next)=>{
    const token = req.cookies.token
    
    if(!token){
        throw new Error("Token not find")
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