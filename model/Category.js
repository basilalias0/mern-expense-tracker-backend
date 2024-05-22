const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    name:{
        type:String,
        required:true,
        default:"Uncategorized"
    },
    type:{
        type:String,
        enum:["income","expense"]
    },
    amount:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("Category",categorySchema)