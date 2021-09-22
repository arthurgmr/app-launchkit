const session = require('express-session');
const MariaDBStore = require('express-session-mariadb-store')


module.exports = session({
    store: new MariaDBStore({
        user: process.env.USER_DB,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }),    
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    }
})

