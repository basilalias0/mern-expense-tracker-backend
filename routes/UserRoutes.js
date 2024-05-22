const express = require('express')
const userController = require('../controller/UserController')
const isAuth = require('../middleware/isAuth')

const userRouter = express.Router()


userRouter.post('/register',userController.registerUser)

userRouter.post('/signin',userController.signInUser)
userRouter.put('/updatepassword',isAuth,userController.updatePassword)
userRouter.put('/updateusername',isAuth,userController.updateUsername)
userRouter.put('/updatename',isAuth,userController.updateName)


module.exports = userRouter