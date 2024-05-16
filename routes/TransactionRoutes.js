const express = require('express')
const isAuth = require('../middleware/isAuth')
const postController = require('../controller/TransactionController')
const transactionController = require('../controller/TransactionController')
const transactionRouter = express.Router()


transactionRouter.get('/',isAuth,transactionController.list)
transactionRouter.get('/create',isAuth,transactionController.createForm)
transactionRouter.post('/create',isAuth,transactionController.create)
transactionRouter.get('/update/:id',isAuth,transactionController.updateForm)
transactionRouter.put('/update/:id',isAuth,transactionController.update)
transactionRouter.get('/delete/:id',isAuth,transactionController.deleteForm)
transactionRouter.delete('/delete/:id',isAuth,transactionController.delete)


module.exports = transactionRouter