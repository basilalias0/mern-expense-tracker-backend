const express = require('express')
const isAuth = require('../middleware/isAuth')
const categoryController = require('../controller/CategoryController')




const categoryRouter = express.Router()

categoryRouter.get('/',isAuth,categoryController.list)
categoryRouter.delete('/delete/:id',isAuth,categoryController.delete)



module.exports = categoryRouter