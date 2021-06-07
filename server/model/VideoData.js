const mongoose = require("mongoose");

var schema = new mongoose.Schema({
    video_id : {
        type : String,
    },
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    publishing_datetime : {
        type : Date,
    },
    thumbnail_urls : {
        type : String,
    }
})

const videoData = mongoose.model('video_data', schema)

module.exports = videoData