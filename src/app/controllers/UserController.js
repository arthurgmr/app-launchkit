
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

            //provisory
            const sameStudent = await Student.findOne({ where: { class_id }})

            const showStudentsOfClass = await Student.showStudentsOfClass(user.id, sameStudent.class_name)

            return res.render("users/show-students-class", { showStudentsOfClass })

        } catch (err) {
            
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