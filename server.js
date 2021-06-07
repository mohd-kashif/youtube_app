const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection")
const session = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path');

const app = express();
dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({extended : true}))
app.set('port', PORT);
app.set("view engine", "ejs")
connectDB();
app.use('/assets', express.static(__dirname + '/static'));
app.use(session({ 
    secret: "print_test",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
})) 
app.set("views", path.join(__dirname, 'views'))

app.use('/', require('./server/routes/router'))
app.use(cookieParser())

app.listen(PORT,() => {console.log('Server is Running on http://localhost:'+PORT)})

module.exports = app;