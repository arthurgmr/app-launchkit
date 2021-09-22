const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')

// dashboard
routes.get('/', UserValidator.index, UserController.index)

// students of class
routes.get('/:class_id', UserValidator.index, UserController.showStudentsOfClass)
routes.put('/save', UserValidator.index, UserController.saveInformation)


module.exports = routes