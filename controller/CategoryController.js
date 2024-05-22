
const asyncHandler = require('express-async-handler')
const Category = require('../model/Category')
const User = require('../model/User')
const Transactions = require('../model/Transactions')


const categoryController= {
    list:asyncHandler(async(req,res)=>{
        const username = req.user.username
        const user = await User.findOne({username})
        const UID = user._id
        const categories = await Category.find({user:UID})
        const categoryList = categories.map((element)=>{
            return({
                id:element.id,
                name:element.name,
                type:element.type,
                amount:element.amount
            })
        })
        res.send(categoryList)
    }),  
    delete:asyncHandler(async(req,res)=>{
        const categoryId = req.params.id
        const user = req.user.username
      const defaultCategory = "Uncategorized"
      const category = await Category.findById(categoryId) 
      const userFound = await User.findOne({username:user})
        const updatedtransaction = await Transactions.updateMany({user:userFound._id,category:category.name},{$set:{category:defaultCategory}})
     const deletedOne = await Category.deleteOne({_id:categoryId})
      res.send(deletedOne)
        
    })
}



module.exports = categoryController