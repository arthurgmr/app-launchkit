const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'students' })

module.exports = {
    ...Base,

    async getClassesAndStudentsQuantity(id) {
        const results = await db.query(`
        SELECT students.class_name, students.class_id, students.regime,
        IF(students.regime = 'undefined', false, true) AS completed,	
            COUNT(*) AS total_students
        FROM students
        WHERE students.user_id = ?
        GROUP BY students.class_name
        `, [id])

        return results
    },

    async showStudentsOfClass(user_id, class_id) {
        const results = await db.query(`
        SELECT students.*, 
        IF(students.class_name LIKE '%BERCARIO%', true, false) AS diaper,
        IF(students.regime = 'undefined', false, true) AS completed
        
    FROM students
            WHERE students.user_id = ?
            AND students.class_id = ?
            ORDER BY students.name
        `, [user_id, class_id] )

        return results
    },

    async printStudentsOfClass(user_id, class_id) {
        const results = await db.query(`
        SELECT * 
            FROM (
                SELECT students.*, 
                IF(students.class_name LIKE '%BERCARIO%', true, false) AS diaper,
                IF(students.regime = 'undefined', false, true) AS completed

                FROM students
                WHERE students.user_id = ?
                AND students.class_id = ?

                ORDER BY students.name
            ) AS students_filter

        WHERE students_filter.regime = "Híbrido" OR students_filter.regime = "Remoto"
        AND students_filter.launchkit = "Sim"
        `, [user_id, class_id ])

        return results
    },

    // async getQuantityInfant() {
    //     const results = await db.query(`
    //     (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //               LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "Educação Infantil - Pré-escola" OR
    //               students.stage = "Educação Infantil -  Creche"
    //         ) AS first_filter
            
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Híbrido"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //     )
            
    //     UNION
            
    //     (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //               LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "Educação Infantil - Pré-escola" OR
    //               students.stage = "Educação Infantil -  Creche"
    //         ) AS first_filter
            
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Remoto"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //     )
             
    //     UNION
            
    //         (SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //               LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "Educação Infantil - Pré-escola" OR
    //               students.stage = "Educação Infantil -  Creche"
    //         ) AS first_filter
            
    //         WHERE 
    //             first_filter.regime = "Presencial"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //     )
    //     ORDER BY school
    //     `)
    //     return results
    // },

    // async getQuantityFundamental() {
    //     const results = await db.query(`
    //     (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "ENSINO FUNDAMENTAL DE 9 ANOS"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Híbrido"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //       )
          
    //       UNION
          
    //       (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "ENSINO FUNDAMENTAL DE 9 ANOS"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Remoto"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //       )
           
    //       UNION
          
    //       (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "ENSINO FUNDAMENTAL DE 9 ANOS"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.regime = "Presencial"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //        )
    //       ORDER BY school
    //     `)
    //     return results
    // },

    // async getQuantityEJAPROEJA() {
    //     const results = await db.query(`
    //     (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL - PROEJA FIC" OR
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Híbrido"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //       )
          
    //       UNION
          
    //       (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL - PROEJA FIC" OR
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.launchkit = "Sim" AND
    //             first_filter.regime = "Remoto"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //       )
           
    //       UNION
          
    //       (
    //         SELECT first_filter.regime, first_filter.launchkit, first_filter.user_id, first_filter.school,
    //         COUNT (*) AS total
    //         FROM (
    //             SELECT students.*, users.name AS school
    //             FROM students
    //             LEFT JOIN users ON(users.id = students.user_id)
    //             WHERE 
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL - PROEJA FIC" OR
    //               students.stage = "PRESENCIAL - ENSINO FUNDAMENTAL"
    //         ) AS first_filter
          
    //         WHERE 
    //             first_filter.regime = "Presencial"
    //         GROUP BY first_filter.school
    //         ORDER BY first_filter.school
    //        )
    //       ORDER BY school
    //     `)
    //     return results
    // },

    async findUserComplete(id) {
        const results = await db.query (`
        SELECT users.*, 
            courses.name AS course_name, 
            colleges.name AS college_name
        FROM users
        LEFT JOIN courses ON(courses.id = users.course_id)
        LEFT JOIN colleges ON(colleges.id = users.college_id)
        WHERE users.id = ?`, [id])

        return results[0]
    },

    async search({filter}) {
        
        let query = `
            SELECT users.*, 
                courses.name AS course_name, 
                colleges.name AS college_name
            FROM users
            LEFT JOIN courses ON(courses.id = users.college_id)
            LEFT JOIN colleges ON(colleges.id = users.college_id)
            WHERE 1 = 1
        `
        if(filter) {
            query += `AND users.name ILIKE '%${filter}%'
            OR users.cpf ILIKE '%${filter}%'` 
        }

        const results = await db.query(query)
        return results
    },

    async classificationRegular() {
        const results = await db.query (`
        SELECT users.*, 
            courses.name AS course_name, 
            colleges.name AS college_name
        FROM users
        LEFT JOIN courses ON(courses.id = users.course_id)
        LEFT JOIN colleges ON(colleges.id = users.college_id)
        WHERE 1 = 1
        AND users.funcs LIKE '%Regular(F01)%'
        ORDER BY 
            deficient DESC, 
            specialization_regular DESC, 
            CAST(period_course AS UNSIGNED) DESC, 
            birth_date ASC
        `)
        return results
    },

    async classificationSpecial() {
        const results = await db.query (`
        SELECT users.*, 
            courses.name AS course_name, 
            colleges.name AS college_name
        FROM users
        LEFT JOIN courses ON(courses.id = users.course_id)
        LEFT JOIN colleges ON(colleges.id = users.college_id)
        WHERE 1 = 1
        AND users.funcs LIKE '%Especial(F02)%'
        ORDER BY 
            deficient DESC, 
            specialization_special DESC, 
            specialization_regular DESC, 
            CAST(period_course AS UNSIGNED) DESC, 
            birth_date ASC
        `)
        return results
    }


}