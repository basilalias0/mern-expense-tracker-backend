const express = require('express')
const userController = require('../controller/UserController')
const isAuth = require('../middleware/isAuth')

const userRouter = express.Router()

userRouter.get('/register',userController.registerPage)
userRouter.post('/register',userController.registerUser)
userRouter.get('/signIn',userController.signInPage)
userRouter.post('/signIn',userController.signInUser)
userRouter.put('/updatePassword',isAuth,userController.updatePassword)
userRouter.put('/updateUsername',isAuth,userController.updateUsername)
userRouter.get('/signOut',userController.signOutUser)


module.exports = userRouter