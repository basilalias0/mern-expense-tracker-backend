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
        const reAmount = amount+(categoryFound?.amount || 0)
        if(!categoryFound){
            await Category.create({
                user:userFound._id,
                name:category,
                type,
                amount
            })
        }else{
            const updatedCategory = await Category.updateOne({name:category,user:userFound._id},{amount:reAmount})
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
        const transactionFound = await Transactions.findById(transactionId)
        const category = transactionFound.category
        const user = transactionFound.user
        let categoryFound = await Category.findOne({name:category,user:user._id})
        const reAmount = (categoryFound?.amount || 0)-(transactionFound?.amount || 0)
        if(categoryFound){
            await Category.updateOne({name:category,user:user._id},{amount:reAmount})
        }
        categoryFound = await Category.findOne({name:category,user:user._id})
        if(categoryFound.amount === 0){
            await Category.deleteOne({name:category,user:user._id})
        }
        const deletedOne = await Transactions.deleteOne({_id:transactionId})
        if(deletedOne){
            res.send(deletedOne)
        }else{
            throw new Error("Error Happened")
        }
    })

}

module.exports = transactionController
