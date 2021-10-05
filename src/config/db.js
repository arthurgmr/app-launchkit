const mariadb = require("mariadb");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const db = mariadb.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000
})

//connect and check for errors
db.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connection');
        }
        if(err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }

    if(connection) connection.release();

    return;
});

module.exports = db;



