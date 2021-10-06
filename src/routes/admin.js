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

// Reports LaunchKit
routes.get('/reports/infant', AdminController.reportsInfant)
routes.get('/reports/fund', AdminController.reportsFund)
routes.get('/reports/ejaproeja', AdminController.reportsEjaProeja)
// routes.get('/reports', AdminController.reportsBySchools)


module.exports = routes