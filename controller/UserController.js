const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY


const User = require('../model/User')
const { Error } = require('mongoose')

const userController = {
    registerUser: asyncHandler(async(req,res)=>{
       const {name,username,password,email} = req.body
       if(!name || !username || !password || !email){
        throw new Error("Data Incomplete")
       }
       const userExistU = await User.findOne({username})
       const userExistE = await User.findOne({email})
       
       if(userExistU){
        throw new Error("username Taken")
       }
       if(userExistE){
        throw new Error("User Exist")
       }
       const payload = {
        username
    }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
    res.cookie('token',token,{
        maxAge:1*24*60*1000,
        httpOnly:true,
        secure:false,
        sameSite:'strict'
    
    })
       const hashedPassword = await bcrypt.hash(password,10)
       const createdUser = await User.create({
        name,
        username,
        password:hashedPassword,
        email
       })
       res.json({
        name,
        username,
        email,
        token
       })
    }),
    signInUser: asyncHandler(async(req,res)=>{
        const {username,password} = req.body
        const userFound = await User.findOne({username})
        if(!userFound){
            throw new Error("User not found",500)
            
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
                sameSite:'strict'
            
            })
            res.json({
                username:userFound.username,
                token:token,
                email:userFound.email,
                name:userFound.name
            })
            res.send("invalid data")
        }
        
    }),
    updatePassword:asyncHandler(async(req,res)=>{
        console.log(req.user);
        const {newPassword,oldPassword} = req.body
        if(newPassword===oldPassword){
            throw new Error("Old password re-entered")
        }
        const username = req.user.username
        console.log(req.user);
        const userFound = await User.findOne({username})
        const passwordMatch = await bcrypt.compare(oldPassword,userFound.password)
        if(!passwordMatch){
            throw new Error("Old password incorrect")
        }
        const hashedPassword =await bcrypt.hash(newPassword,10)
        const passwordChanged = await User.updateOne({username},{password:hashedPassword})
        if(!passwordChanged){
            throw new Error("Password not changed")
        }else{
            const payload = {
                username
            }
            const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
            res.json({
                username,
                token,
                email:userFound.email,
                name:userFound.name
               })
        }
    }),
    updateUsername:asyncHandler(async(req,res)=>{
        const {username} = req.body
        console.log(req.body);
        console.log(req.user);
        const userExist = await User.findOne({username})
        if (username === req.user.username){
            throw new Error("Same username entered!!")
        }else if(userExist){
            throw new Error("Username already exist, Try different one")
        }else{
            await User.updateOne({username:req.user.username},{username})
        }
        const userFound = await User.findOne({username})
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

            res.json({
                username,
                token,
                email:userFound.email,
                name:userFound.name
               })
        
    }),
    updateName:asyncHandler(async(req,res)=>{
        const {name} = req.body
        console.log(name);
        await User.updateOne({username:req.user.username},{name})
        const userFound = await User.findOne({username:req.user.username})
        const username=userFound.username
        const payload = {
            username
        }
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
        
        res.json({
            username,
            token,
            email:userFound.email,
            name:userFound.name
           })
        }),
}

module.exports = userController