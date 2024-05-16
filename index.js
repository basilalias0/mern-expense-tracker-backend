require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const userRouter = require('./routes/UserRoutes');
const cookieParser = require('cookie-parser');
const errorhandler = require('./middleware/ErrorHandler');
const categoryRouter = require('./routes/categoryRoutes');
const transactionRouter = require('./routes/TransactionRoutes');


const connectDB = async()=>{
    try {

        await mongoose.connect("mongodb+srv://basilalyas2000:Lock1234@cluster.qalqigg.mongodb.net/ExpenseTackerDB?retryWrites=true&w=majority&appName=Cluster")
    console.log("DB connected successfully");
        
    } catch (error) {
        console.log("we got a error: ",error);
    }
    
}

connectDB()

const app = express()
app.use(cookieParser());
app.use(express.json());
app.use(errorhandler)


app.get('/api/v1/',(req,res)=>{
    res.send("This is hOme page")
})
app.get('/api/v1/dashboard',(req,res)=>{
    res.send("This is dashboard Page")
})
app.use('/api/v1/user',userRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/transaction',transactionRouter)


app.listen(3000,()=>{
    console.log("http://localhost:3000");
})