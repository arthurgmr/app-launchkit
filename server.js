const { app } = require("./src/app.js")
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT || 5000, function (){
    console.log("server is running")
})