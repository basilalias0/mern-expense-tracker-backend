const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const User = require('../model/User')
const { Error } = require('mongoose')

const userController = {
    registerPage:asyncHandler(async(req,res)=>{
        res.send("This is register page")
    }),
    registerUser: asyncHandler(async(req,res)=>{
       const {name,username,password,email} = req.body
       if(!username || !password || !email){
        throw new Error("Data Incomplete")
       }
       const userExist = await User.findOne({username})
       
       if(userExist){
        throw new Error("user Exist")
       }
       const hashedPassword = await bcrypt.hash(password,10)
       const createdUser = await User.create({
        name,
        username,
        password:hashedPassword,
        email
       })
       res.json(createdUser)
       res.redirect('/dashboard')
    }),
    signInPage:asyncHandler(async(req,res)=>{
        res.send("This is SignIn Page")
    }),
    signInUser: asyncHandler(async(req,res)=>{
        const {username,password} = req.body
        const userFound = await User.findOne({username})
        if(!userFound){
            throw new Error("User not found")
        }
        const passwordCheck = await bcrypt.compare(password,userFound.password)
        if (!passwordCheck){
            throw new Error("Password not match")
        }
        const payload = {
            username
        }
        if(userFound && passwordCheck){
            const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
            res.cookie('token',token,{
                maxAge:1*24*60*1000,
                httpOnly:true,
                secure:false,
                sameSite:true
            })


            res.redirect('/dashboard')
        }else{
            res.send("invalid data")
        }
        
    }),
    updatePassword:asyncHandler(async(req,res)=>{
        console.log(req.user);
        const {password} = req.body
        console.log(password);
        const username = req.user.username
        console.log(req.user);
        const userFound = await User.findOne({username})
        if(!userFound){
            throw new Error("User not found")
        }
        const hashedPassword =await bcrypt.hash(password,10)
        const passwordChanged = await User.updateOne({username},{password:hashedPassword})
        if(!passwordChanged){
            throw new Error("Password not changed")
        }else{
            res.redirect('/dashboard')
        }
    }),
    updateUsername:asyncHandler(async(req,res)=>{
        const {username} = req.body
        const userExist = await User.findOne({username:username})
        if (username === req.user.username){
            throw new Error("Same username entered!!")
        }else if(userExist){
            throw new Error("Username already exist, Try different one")
        }else{
            await User.updateOne({username:req.user.username},{username})
        }
        res.clearCookie('token')
        const payload = {
            username
        }
        
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
            res.cookie('token',token,{
                maxAge:1*24*60*1000,
                httpOnly:true,
                secure:false,
                sameSite:true
            })

            res.redirect('/dashboard')
        
    }),
    signOutUser: asyncHandler(async(req,res)=>{
        res.clearCookie()
        res.redirect('/')
    })
}

module.exports = userController