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
    },
    created_at: { type: Date, required: true, default: Date.now }
})

const videoData = mongoose.model('video_data', schema)

const saveDataToCollection = (data) => {
    new videoData(data).save(function (error, data) {
        if (error)
            throw new Error(error);
        console.log("youtube videos data inserted");
    });
}

module.exports = {
    videoData,
    saveDataToCollection
}