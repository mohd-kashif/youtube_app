const videoData = require("../model/VideoData");
const YoutubeService = require("../services/YoutubeService")

const homeRoute = (req, res) => {
    res.render("homepage_view")
}

const searchRoute = async (req, res) => {
    try {
        let videoTitle = checkAndSetDefaultTitile(req)
        var result = await YoutubeService.searchVideosData(videoTitle)
        return sendSuccessResponse(res, result);
    } catch (err) {
        console.log(err);
        return sendFailureResponse(res, err);
    }
}

const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        var result = await YoutubeService.getVideos(limit, skipIndex)
        return sendSuccessResponse(res, result)
    } catch (err) {
        console.log(err);
        return sendFailureResponse(res, err)
    }
}


function sendFailureResponse(res, err) {
    return res.status(500).send({
        success: false,
        data: err
    });
}

function sendSuccessResponse(res, result) {
    return res.status(200).send({
        success: true,
        data: result
    });
}

function checkAndSetDefaultTitile(req) {
    let videoTitle = req.query.video_title;
    if (videoTitle === undefined) {
        videoTitle = '';
    }
    return videoTitle;
}

module.exports = {
    homeRoute,
    searchRoute,
    getVideos
}