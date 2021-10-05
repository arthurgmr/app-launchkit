const { date } = require("../../lib/utils")

const Student = require('../models/Student');


module.exports = {
     async index(req, res) {
        try {
            const { user } = req

            const classesAndStudents = await Student.getClassesAndStudentsQuantity(user.id)
            
            return res.render('users/index', { user, classesAndStudents })
            
        } catch (err) {
            console.log(err)
        }
    },

    async showStudentsOfClass(req, res) {
        try {
            const { user } = req
            const { class_id } = req.params

            const showStudentsOfClass = await Student.showStudentsOfClass(user.id, class_id)

            return res.render("users/show-students-class", { showStudentsOfClass })

        } catch (err) {
            console.log(err)
            // return res.render("user/import-users", {
            //     error: "Algo de errado aconteceu."
            // })
        }
    },

    async printStudentsOfClass(req, res) {
        try {

            const { user } = req
            const { class_id } = req.params

            const dataPrint = await Student.printStudentsOfClass(user.id, class_id)

            if(!dataPrint[0]) {
                return res.render("users/index", {
                    user,
                    classesAndStudents: await Student.getClassesAndStudentsQuantity(user.id),
                    error: "Nenhum aluno informado no Kit Merenda."
                })
            }

            const dateNow = date(Date.parse(new Date())).formatTotal

            return res.render("users/print-class", { user, dataPrint, dateNow })

            
        } catch (err) {
            console.log(err)
        }
    },

    async saveInformation(req, res) {
        try {

            const { user } = req
            const data = req.body

            Object.keys(data).forEach(async (student) => {

                const field = student.split(" ", 2)[0]
                const studentId = student.split(" ", 2)[1]
                
                if(field === "regime") {
                    await Student.update(studentId, { regime: data[student] })
                }
                if(field === "launchkit") {
                    await Student.update(studentId, { launchkit: data[student] })
                }
                if(field === "diaper_size") {
                    await Student.update(studentId, { diaper_size: data[student] })
                }
            })

            const classesAndStudents = await Student.getClassesAndStudentsQuantity(user.id)

            return res.render("users/index", { 
                success: "Informações salvas com Sucesso!",
                user,
                classesAndStudents
             })

        } catch (err) {
            
        }
    }
}