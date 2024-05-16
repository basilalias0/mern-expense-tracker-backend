const express = require('express')
const isAuth = require('../middleware/isAuth')
const categoryController = require('../controller/categoryController')



const categoryRouter = express.Router()

categoryRouter.get('/',isAuth,categoryController.list)
categoryRouter.get('/create',isAuth,categoryController.createForm)
categoryRouter.post('/create',isAuth,categoryController.create)
categoryRouter.get('/update/:id',isAuth,categoryController.updateForm)
categoryRouter.put('/update/:id',isAuth,categoryController.update)
categoryRouter.get('/delete/:id',isAuth,categoryController.deleteForm)
categoryRouter.delete('/delete/:id',isAuth,categoryController.delete)



module.exports = categoryRouter