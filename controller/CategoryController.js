
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
                name:element.name,
                type:element.type
            })
        })
        res.json({
            categories:categoryList
        })
    }),
    createForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Showing Creation Form"
        })
    }),
    create:asyncHandler(async(req,res)=>{
        const {name,type} = req.body
        const user = req.user.username
        const userFound = await User.findOne({username:user})
        const nameExists = await Category.findOne({name,user:userFound._id})
        const validCategory = ["income","expense"]
        if(!name || !type){
            throw new Error("Name or type not attached")
        }else if(!validCategory.includes(type.toLowerCase())){
            throw new Error("Invalid category")
        }else if(nameExists){
            throw new Error("Name already exist")
        }else{
         await Category.create({
            name,
            type,
            user:userFound._id
        })
        res.redirect('/category')
    }    
    }),
    
    updateForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Updating Fom"
        })
    }),
    update:asyncHandler(async(req,res)=>{
        const categoryId = req.params.id
        updatedData = {}
        if(!categoryId){
            throw new Error(" id not imported")
        }else{
            const {type,name} = req.body
            if(!type && !name){
                throw new Error("Necessary data not given")
            }else{
                
                if(type !== undefined){
                    updatedData.type = type
                }
                if(name !== undefined){
                    updatedData.name = name
                }
                

                await Category.updateOne({_id:categoryId},updatedData)
                res.redirect('/category')
            }
        }
    }),
    deleteForm:asyncHandler(async(req,res)=>{
        res.json({
            message:"Deleting Form"
        })
    }),
    delete:asyncHandler(async(req,res)=>{
        const categoryId = req.params.id
        const user = req.user.username
      const defaultCategory = "Uncategorized"
      const category = await Category.findById(categoryId) 
      const userFound = await User.findOne({username:user})
      console.log(category);
        const updatedtransaction = await Transactions.updateMany({user:userFound._id,category:category.name},{$set:{category:defaultCategory}}) 
     console.log(updatedtransaction);
     const deletedOne = await Category.deleteOne({_id:categoryId})
     console.log(deletedOne);
      res.redirect('/category')
        
    })
}



module.exports = categoryController