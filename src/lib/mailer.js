const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  },
  tls: { rejectUnauthorized: false }
});

  module.exports = transport


 
//    host: "mail.digiescola.com.br",
//    port: 25,
//    secure: false,
//   auth: {
//      user: "mail@digiescola.com.br",
//      pass: "0s3xrL@9"
//    },
//    tls: { rejectUnauthorized: false }
 