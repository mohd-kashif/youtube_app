const express = require("express")
const route = express.Router();
const YoutubeController = require("../controller/YoutubeController")


route.get('/', YoutubeController.homeRoute)
route.get('/search', YoutubeController.searchRoute)
route.get('/getVideos', YoutubeController.getVideos)
module.exports = route;