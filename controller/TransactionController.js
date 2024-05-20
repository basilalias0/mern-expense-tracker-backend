const asyncHandler = require('express-async-handler')
const Transactions = require('../model/Transactions')
const User = require('../model/User')
const Category = require('../model/Category')
const transactionController = {
    list:asyncHandler(async(req,res)=>{
        const username = req.user.username
        const user = await User.findOne({username})
        const UID = user._id
        const transactionList = await Transactions.find({user:UID})
        const listArray = transactionList.map((element)=>element)
        const sortedTransactions = listArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.send(sortedTransactions)
    }),
    create:asyncHandler(async(req,res)=>{
        const {category,type,amount,date,description} = req.body
        if(!category || !type || !amount ||!date){
            throw new Error("Necessary data not given")
        }else{
            const user = req.user.username
        const userFound = await User.findOne({username:user})
        if(!userFound){
            throw new Error("User not Found")
        }
        const categoryFound = await Category.findOne({name:category,user:userFound._id})
        if(!categoryFound){
            await Category.create({
                user:userFound._id,
                name:category,
                type
            })
        }
         const createdTransaction = await Transactions.create({
            user:userFound._id,
            category,
            type,
            amount,
            date,
            description
        })
        res.send(createdTransaction)
        }
    }),
    delete:asyncHandler(async(req,res)=>{
        transactionId = req.params.id
        const deletedOne = await Transactions.deleteOne({_id:transactionId})
        res.redirect('/transaction')
    })

}

module.exports = transactionController
