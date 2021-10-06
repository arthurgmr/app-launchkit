const { hash } = require("bcryptjs")
const { compare } = require('bcryptjs')
const fs = require("fs")
const csvParse = require("csv-parse")
const { date } = require("../../lib/utils")


const User = require("../models/User")
const Student = require("../models/Student")


module.exports = {
  async index(req, res) {
    try {
      return res.render("admin/index",)

    } catch (err) {
      console.log(err);
    }
  },
  
  async createUserAdmin(req, res) {
    try {

      const users = [
        {
          name: "Guilherme Saito",
          email: "guilherme@edu.muriae.mg.gov.br",
          role: "admin",
          password_master: await hash("atencaonolayout", 8)
        },
        {
          name: "Arlove",
          email: "arlove@edu.muriae.mg.gov.br",
          role: "admin",
        },
        {
          name: "Arthur Machado",
          email: "arthur@edu.muriae.mg.gov.br",
          role: "admin",
          password_master: await hash("atencaonolayout", 8)
        },
        {
          name: "Fabiana",
          email: "fabiana@edu.muriae.mg.gov.br",
          role: "admin",
        }
      ]
      
      Promise.all(users.map((user) => User.create(user)))

      return res.send()

    } catch (err) {
      console.log(err);
      
    }
  },

  // Import Users
  async indexImportUsers(req, res) {

    try {

      return res.render("admin/import-users")
      
    } catch (err) {
      console.log(err);
    }
    
  },
  async importUsers(req, res) {
    try {
            
      // validate password master;
      const user = await User.findOne({ where: { id: req.session.userId } })
      const { password_master } = req.body

      const passed = await compare(password_master, user.password_master)

      if (!passed) return res.render("admin/index", {
          error: "Senha master incorreta!"
      })

      // csv > JSON      
      const { file } = req
      const users = await loadUsersFile(file)

      users.map(async (userImport) => {
        const { email } = userImport

        const user = await User.findOne({ where: { email } })

        if (user) {
          await User.update(user.id, {
            name: userImport.name,
            password: await hash(userImport.password, 8)
          })
        } else {
          userImport.password = await hash(userImport.password, 8)
          userImport.role = "user"
          await User.create(userImport)
        }

      })

      return res.render("admin/index", {
        success: "Escolas importados com sucesso."
      })


    }  catch (err) {
      console.log(err)
      return res.render("admin/import-users", {
        error: "Algo de errado aconteceu."
      })
    }
  },

  // Import Students
  async indexImportStudents(req, res) {

    try {

      return res.render("admin/import-students")
      
    } catch (err) {
      console.log(err);
    }
    
  },
  async importStudents(req, res) {
    try {
      
      // validate password master;
      const user = await User.findOne({ where: { id: req.session.userId } })
      const { password_master } = req.body

      const passed = await compare(password_master, user.password_master)

      if (!passed) return res.render("admin/index", {
          error: "Senha master incorreta!"
      })

      // csv > JSON
      const { file } = req
      const studentsImportFile = await loadStudentsFile(file)

      // get students already imported in last time;
      const students = await Student.findAll()

      // logic import user, creating and updating;
      const studentsImport = studentsImportFile.map(async (studentImport) => {
        // remove ' of the name;
        const name = studentImport.name.replace(/'/g, "")
        // get school;
        const school = await User.findOne({ where: { name: studentImport.school }})

        // check student exists;
        let student
        students 
          ? student = students.find((student) => 
            student.name === name && 
            student.birth_date === studentImport.birth_date) 
          : null;

        if (!student) {

          await Student.create({
            name: studentImport.name.replace(/'/g, ""),
            birth_date: studentImport.birth_date,
            user_id: school.id,
            stage: studentImport.stage,
            class_id: studentImport.classes_id,
            class_name: studentImport.classes,
            regime: undefined,
            launchkit: undefined,
            diaper_size: undefined
          })
          
        } else {

          await Student.update(student.id, {
            birth_date: studentImport.birth_date,
            user_id: school.id,
            stage: studentImport.stage,
            class_id: studentImport.classes_id,
            class_name: studentImport.classes
          })
        }
      })

      await Promise.all(studentsImport)

      // logic to remove students who are not on the import file
      students.filter(async (st) => {
        const studentsOk = studentsImportFile.find((stImport) => stImport.name === st.name)
        
        if(!studentsOk) {
          await Student.delete(st.id)
        }
      })

      return res.render("admin/index", {
        success: "Alunos importados com sucesso."
      })


    } catch (err) {
      console.log(err)
      return res.render("admin/import-students", {
        error: "Algo de errado aconteceu."
      })
    }

  },

  // Reports Launch Kit
  async reportsInfant(req, res) {

    try {
      const { user } = req

      const dataReport = await User.getQuantityInfant()

      let total = {
        report: 'Educação Infantil',
        name: 'TOTAL',
        total_remote: 0,
        total_hybrid: 0,
        total_present: 0
      }
      
      dataReport.forEach((element) => {
        total.total_remote += element.total_remote
        total.total_hybrid += element.total_hybrid
        total.total_present += element.total_present
      })

      dataReport.push(total)

      const dateNow = date(Date.parse(new Date())).formatTotal

      return res.render("admin/reports-launchkit", { user, dateNow, dataReport })

    } catch (err) {
      console.log(err)
      return res.render("admin/import-students", {
        error: "Algo de errado aconteceu."
      })
    }

  },  
  async reportsFund(req, res) {

    try {
      const { user } = req

      const dataReport = await User.getQuantityFundamental()

      let total = {
        report: 'Ensino Fundamental',
        name: 'TOTAL',
        total_remote: 0,
        total_hybrid: 0,
        total_present: 0
      }
      
      dataReport.forEach((element) => {
        total.total_remote += element.total_remote
        total.total_hybrid += element.total_hybrid
        total.total_present += element.total_present
      })

      dataReport.push(total)

      const dateNow = date(Date.parse(new Date())).formatTotal

      return res.render("admin/reports-launchkit", { user, dateNow, dataReport })

    
    } catch (err) {
      console.log(err)
      return res.render("admin/import-students", {
        error: "Algo de errado aconteceu."
      })
    }

  },
  async reportsEjaProeja(req, res) {

    try {
      const { user } = req

      const dataReport = await User.getQuantityEjaProeja()

      let total = {
        report: 'EJA e PROEJA',
        name: 'TOTAL',
        total_remote: 0,
        total_hybrid: 0,
        total_present: 0
      }
      
      dataReport.forEach((element) => {
        total.total_remote += element.total_remote
        total.total_hybrid += element.total_hybrid
        total.total_present += element.total_present
      })

      dataReport.push(total)

      const dateNow = date(Date.parse(new Date())).formatTotal

      return res.render("admin/reports-launchkit", { user, dateNow, dataReport })

      
    } catch (err) {
      console.log(err)
      return res.render("admin/import-students", {
        error: "Algo de errado aconteceu."
      })
    }

  },

  // Report Diaper Size
  async reportsDiapersSize(req, res) {
    try {
      
      const { user } = req

      const dataReport = await User.getQuantityDiaperSize()

      let total = {
        report: 'Tamanho de Fralda',
        name: 'TOTAL',
        total_M: 0,
        total_G: 0,
        total_GG: 0,
        total_XXG: 0
      }
      
      dataReport.forEach((element) => {
        total.total_M += element.total_M
        total.total_G += element.total_G
        total.total_GG += element.total_GG
        total.total_XXG += element.total_XXG
      })

      dataReport.push(total)

      const dateNow = date(Date.parse(new Date())).formatTotal

      return res.render("admin/reports-diapersize", { user, dateNow, dataReport })


    } catch (err) {
      console.log(err)
      return res.render("admin/import-students", {
        error: "Algo de errado aconteceu."
      })
    }
  }
}

function loadUsersFile (file) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const users = []

    const parseFile = csvParse()

    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [email, name, password] = line
        users.push({
          email,
          name,
          password
        })
      })
      .on('end', () => {
        fs.promises.unlink(file.path)
        resolve(users)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

function loadStudentsFile (file) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file.path)
    const users = []

    const parseFile = csvParse()

    stream.pipe(parseFile)

    parseFile
      .on('data', async (line) => {
        const [name, birth_date, school, stage, classes_id, classes] = line
        users.push({
          name,
          birth_date,
          school,
          stage,
          classes_id,
          classes
        })
      })
      .on('end', () => {
        fs.promises.unlink(file.path)
        resolve(users)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}