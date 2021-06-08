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

setIndexes();


let Videos = mongoose.model('video_data', schema);

const saveDataToCollection = (data) => {
    new Videos(data).save(function (error, data) {
        if (error)
            throw new Error(error);
        console.log("youtube videos data inserted");
    });
}

const getSearchQueryResult = (query, options) => {
    return Videos.find(query, {}, options);
}

const getAllVideos = (query, options, limit, skipIndex) => {
    return Videos.find(query, {}, options).limit(limit).skip(skipIndex);
}

function setIndexes() {
    schema.index({ video_id: 1 });
    schema.index({ title: 1 });
    schema.index({ description: 1 });
}

module.exports = {
    saveDataToCollection,
    getSearchQueryResult,
    getAllVideos
}