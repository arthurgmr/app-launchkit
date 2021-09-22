const express = require('express')
const routes = express.Router()


const { onlyUsers, onlyUsersAdmin } = require('../app/middlewares/session')
const AdminController = require('../app/controllers/AdminController')


const admin = require('./admin')
const users = require('./users')
const session = require('./session')

routes.get('/', (req, res) => {
        return res.redirect("session/login")
})

routes.use('/users', onlyUsers, users)

routes.use('/admin', onlyUsersAdmin, admin)
routes.post('/create', AdminController.createUserAdmin)

routes.use('/session', session)

routes.get('/accounts', function (req, res) {
        return res.redirect("session/login")
})

module.exports = routes