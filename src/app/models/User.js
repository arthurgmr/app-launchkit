const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    
    ...Base,

    async getQuantityInfant() {
        const results = await db.query(`
            SELECT users.id, users.name,
                COUNT(IF(regime = "Remoto" AND launchkit = "Sim", 1, NULL)) AS total_remote,
                COUNT(IF(regime = "Híbrido" AND launchkit = "Sim", 1, NULL)) AS total_hybrid,
                COUNT(IF(regime = "Presencial", 1, NULL)) AS total_present
            FROM users
                LEFT JOIN students ON (students.user_id = users.id)
            WHERE users.role = "user" 
                AND stage NOT LIKE "ENSINO FUNDAMENTAL DE 9 ANOS"
                AND stage NOT LIKE "PRESENCIAL - ENSINO FUNDAMENTAL - PROEJA FIC"
                AND stage NOT LIKE "PRESENCIAL - ENSINO FUNDAMENTAL"
            GROUP BY users.name
            ORDER BY users.name
        `)
        return results
    },

    async getQuantityFundamental() {
        const results = await db.query(`
            SELECT users.id, users.name,
                COUNT(IF(regime = "Remoto" AND launchkit = "Sim", 1, NULL)) AS total_remote,
                COUNT(IF(regime = "Híbrido" AND launchkit = "Sim", 1, NULL)) AS total_hybrid,
                COUNT(IF(regime = "Presencial", 1, NULL)) AS total_present
            FROM users
                LEFT JOIN students ON (students.user_id = users.id)
            WHERE users.role = "user" 
                AND stage NOT LIKE "Educação Infantil -  Creche"
                AND stage NOT LIKE "Educação Infantil - Pré-escola"
                AND stage NOT LIKE "PRESENCIAL - ENSINO FUNDAMENTAL - PROEJA FIC"
                AND stage NOT LIKE "PRESENCIAL - ENSINO FUNDAMENTAL"
            GROUP BY users.name
            ORDER BY users.name
        `)
        return results
    },

    async getQuantityEjaProeja() {
        const results = await db.query(`
            SELECT users.id, users.name,
                COUNT(IF(regime = "Remoto" AND launchkit = "Sim", 1, NULL)) AS total_remote,
                COUNT(IF(regime = "Híbrido" AND launchkit = "Sim", 1, NULL)) AS total_hybrid,
                COUNT(IF(regime = "Presencial", 1, NULL)) AS total_present
            FROM users
                LEFT JOIN students ON (students.user_id = users.id)
            WHERE users.role = "user" 
                AND stage NOT LIKE "Educação Infantil -  Creche"
                AND stage NOT LIKE "Educação Infantil - Pré-escola"
                AND stage NOT LIKE "ENSINO FUNDAMENTAL DE 9 ANOS"
            GROUP BY users.name
            ORDER BY users.name
        `)
        return results
    }

}