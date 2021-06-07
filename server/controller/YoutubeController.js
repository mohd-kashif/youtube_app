var request = require("request");
const videoData = require("../model/VideoData");
const YouTubeService = require("../services/YoutubeService")

const fetchYoutubeData = async () => {
    console.log("start yt fetch")

    var options = {
        method: 'GET',
        url: 'https://youtube.googleapis.com/youtube/v3/search',
        qs: {
            order: 'date',
            publishedAfter: '2021-06-01T00:00:00Z',
            type: 'video',
            key: 'AIzaSyDD1dhRnHZQPVCpVlagY-1cy5UsHts2yMs',
            part: 'snippet',
            q: 'football'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body)
        for (var i = 0; i < body.pageInfo.resultsPerPage; i++) {
            var id = body.items[i].id.videoId
            var snippetData = body.items[i].snippet
            var title = snippetData.title
            var description = snippetData.description
            var publishing_datetime = snippetData.publishedAt
            var thumbnailData = snippetData.thumbnails
            var thumbnailUrls = ''
            var thumbnailUrls = thumbnailUrls + thumbnailData.default.url + ','
            var thumbnailUrls = thumbnailUrls + thumbnailData.medium.url + ','
            var thumbnailUrls = thumbnailUrls + thumbnailData.high.url
            insertData = {
                video_id: id,
                title: title,
                description: description,
                publishing_datetime: publishing_datetime,
                thumbnail_urls: thumbnailUrls
            }
            new videoData(insertData).save(function (error, data) {
                if (error) throw new Error(error);
                console.log("data inserted")
            });
        }
    });
}


const homeRoute = (req, res) => {
    res.render("homepage_view")
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchRoute = async (req, res) => {
    try {
        let video_title = req.query.video_title;
        const page = parseInt(req.query.page);
        console.log(page);
        const limit = parseInt(req.query.limit);
        console.log(limit);
        const skipIndex = (page - 1) * limit;
        console.log(skipIndex);
        const query = {
            'title': new RegExp(escapeRegex(video_title), 'i')
        }
        const options = {
            sort: {
                'publishing_datetime': -1
            },
            projection: {
                _id: 0,
                video_id : 1,
                title: 1,
                description: 1,
                publishing_datetime : 1

            },
        };
        var result = await videoData.find(query, {}, options).limit(limit).skip(skipIndex)
        console.log(result);
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
    fetchYoutubeData,
    homeRoute,
    searchRoute
}