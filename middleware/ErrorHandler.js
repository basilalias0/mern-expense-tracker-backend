

const errorhandler = ((err,req,res,next)=>{
    res.json({
        message:err.message,
        stack:err.stack
    })
})

module.exports = errorhandler