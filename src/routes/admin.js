const express = require('express')
const routes = express.Router()
const multer = require('multer')

const AdminController = require('../app/controllers/AdminController')

const upload = multer({
    dest: "./tmp"
})

routes.get('/', AdminController.index)


routes.get('/import/users', AdminController.indexImportUsers)
routes.post('/import/users', upload.single("file"), AdminController.importUsers)

routes.get('/import/students', AdminController.indexImportStudents)
routes.post('/import/students', upload.single("file"), AdminController.importStudents)


// routes.get('/reports/launchkit', AdminController.reportsLaunchKit)
// routes.get('/reports', AdminController.reportsBySchools)


module.exports = routes