const { compare } = require('bcryptjs')

const User = require('../models/User')

function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect('/session/login')

    next()
}

async function onlyUsersAdmin(req, res, next) {

    const user = await User.findOne({ where: { id: req.session.userId } })
    
    if(user && !user.role === 'admin')
        return res.redirect('/users')

    next()
}

async function onlyUsersAdminMaster(req, res, next) {

    // const { password } = req.body
    const user = await User.findOne({ where: { id: req.session.userId } })
    console.log(req.body)

    const passed = await compare(password, user.password_master)

    if (!passed) return res.render("admin/index", {
        user: req.body,
        error: "Senha master incorreta."
    })

    next()
}

async function isLoggedRedirectToUsers(req, res, next) {
    
    const user = await User.findOne({ where: { id: req.session.userId } })
    
    if (user && user.role === 'user') {
        return res.redirect('/users')
    }

    if (user && user.role === "admin") {
        return res.redirect('/admin')
    }
        
    next()
}

module.exports = {
    onlyUsers,
    onlyUsersAdmin,
    isLoggedRedirectToUsers,
    onlyUsersAdminMaster
}