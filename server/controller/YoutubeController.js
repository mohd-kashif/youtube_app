const videoData = require("../model/VideoData");

const homeRoute = (req, res) => {
    res.render("homepage_view")
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchRoute = async (req, res) => {
    try {
        let video_title = req.query.video_title;
        if (video_title === undefined) {
            video_title = ''
        }
        console.log(video_title)
        const query = {
            $or: [{
                'title': new RegExp(escapeRegex(video_title), 'i')
            }, {
                'description': new RegExp(escapeRegex(video_title), 'i')
            }]
        }
        const options = {
            sort: {
                'publishing_datetime': -1
            },
            projection: {
                _id: 0,
                video_id: 1,
                title: 1,
                description: 1,
                publishing_datetime: 1

            },
        };
        var result = await videoData.find(query, {}, options)
        return res.status(200).send({
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            data: err
        });
    }
}

const getVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const query = {}
        const options = {
            sort: {
                'publishing_datetime': -1
            },
            projection: {
                _id: 0,
                video_id: 1,
                title: 1,
                description: 1,
                publishing_datetime: 1

            },
        };
        var result = await videoData.find(query, {}, options).limit(limit).skip(skipIndex)
        return res.status(200).send({
            success: true,
            data: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            data: err
        });
    }
}

module.exports = {
    homeRoute,
    searchRoute,
    getVideos
}