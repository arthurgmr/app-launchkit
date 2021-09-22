const { compare } = require('bcryptjs')
const User = require('../models/User')

async function login(req, res, next) {

    const { email, password } = req.body

    // check register user
    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
        user: req.body,
        error: "Dados incorretos."
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("session/login", {
        user: req.body,
        error: "Dados incorretos."
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Usuário não registrado."
        })

        req.user = user

        next()

    } catch (err) {
        console.log(err)
        return res.render("session/forgot-password", {
            error: "Algum erro aconteceu, contacte o administrador."
        })
    }
}

async function reset(req, res, next) {

    const { email, password, passwordRepeat, token } = req.body

    try {
        //search user
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "E-mail não cadastrado."
        })

        //if password match
        if (password != passwordRepeat)
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: 'As senhas não conferem.'
            })

        //check match token
        if (token != user.reset_token) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token não confere.'
        })

        //check if token has expired
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Token expirado.'
        })

        req.user = user

        next()

    } catch (err) {
        console.log(err)
        return res.render("session/password-reset", {
            error: "Algum erro aconteceu, contacte o administrador."
        })
    }

}

module.exports = {
    login,
    forgot,
    reset
}