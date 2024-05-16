const asyncHandler = require('express-async-handler')
const Transactions = require('../model/Transactions')
const User = require('../model/User')
const transactionController = {
    list:asyncHandler(async(req,res)=>{
        const username = req.user.username
        const user = await User.findOne({username})
        const UID = user._id
        const transactionList = await Transactions.find({user:UID})
        const listArray = transactionList.map((element)=>element)
        res.send(listArray)
    }),
    createForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Showing transaction form"
        })
    }),
    create:asyncHandler(async(req,res)=>{
        const {category,type,amount,date,description} = req.body
        if(!category || !type || !amount ||!date){
            throw new Error("Necessary data not given")
        }else{
            const user = req.user.username
        const userFound = await User.findOne({username:user})
        const createdTransaction = await Transactions.create({
            user:userFound._id,
            category,
            type,
            amount,
            date,
            description
        })
        res.redirect('/transaction')
        }
    }),
    updateForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Updating Fom"
        })
    }),
    update:asyncHandler(async(req,res)=>{
        const transaction = req.params.id
        updatedData = {}
        if(!transaction){
            throw new Error("Invalid id imported")
        }else{
            const {category,type,amount,date,description} = req.body
            if(!category && !type && !amount && !date && !description){
                throw new Error("Necessary data not given")
            }else{
                if(category !== undefined){
                    updatedData.category = category
                }
                if(type !== undefined){
                    updatedData.type = type
                }
                if(amount !== undefined){
                    updatedData.amount = amount
                }
                if(date !== undefined){
                    updatedData.date = date
                }
                if(description !== undefined){
                    updatedData.description = description
                }

                const updatedTransaction = await Transactions.updateOne({_id:transaction},updatedData)
                res.redirect('/transaction')
            }
        }
    }),
    deleteForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Deleting Form"
        })
    }),
    delete:asyncHandler(async(req,res)=>{
        transactionId = req.params.id
        const deletedOne = await Transactions.deleteOne({_id:transactionId})
        res.redirect('/transaction')
    })

}

module.exports = transactionController
