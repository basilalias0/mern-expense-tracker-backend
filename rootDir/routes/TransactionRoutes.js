const express = require('express')
const isAuth = require('../middleware/isAuth')
const postController = require('../controller/TransactionController')
const transactionController = require('../controller/TransactionController')
const transactionRouter = express.Router()


transactionRouter.get('/',isAuth,transactionController.list)
transactionRouter.post('/create',isAuth,transactionController.create)
transactionRouter.delete('/delete/:id',isAuth,transactionController.delete)


module.exports = transactionRouter