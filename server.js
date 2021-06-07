const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./server/database/connection")
const YoutubeService = require("./server/services/YoutubeService")
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080

setAppEnv();
setInterval(function () {
    YoutubeService.fetchYoutubeData();
}, 10000);

function setAppEnv() {
    dotenv.config({path:'config.env'})
    connectDB();
    app.use(morgan('tiny'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('port', PORT);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, 'views'));
    app.use('/', require('./server/routes/router'));
    app.listen(PORT, () => { console.log('Server is Running on http://localhost:' + PORT); });
}

module.exports = app;