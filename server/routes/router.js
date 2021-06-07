const express = require("express")
const route = express.Router();
const YoutubeController = require("../controller/YoutubeController")


route.get('/', YoutubeController.homeRoute)
route.get('/search', YoutubeController.searchRoute)
module.exports = route;