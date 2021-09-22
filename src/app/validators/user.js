const { compare } = require('bcryptjs')

const User = require('../models/User')

function checkAllFields(body) {
    //check if has all fields
    let keys = Object.keys(body)
    
    keys = keys.filter(key => key !== 'address_complement' && key !== 'phone2')

    for(key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Os campos obrigatórios não foram preenchidos.'
            }
        }           
    }
}


async function index(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({where: {id}})

        if (!user) return res.render("users/register", {
            error: "Usuário não encontrado"
        })

        req.user = user

    next()
}

module.exports = {
    index
}