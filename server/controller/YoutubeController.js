var request = require("request");
const videoData = require("../model/VideoData");
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
        for (var i = 0; i < body.pageInfo.resultsPerPage; i++){
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
                video_id : id,
                title : title,
                description : description,
                publishing_datetime : publishing_datetime,
                thumbnail_urls : thumbnailUrls
            }
            new videoData(insertData).save(function (error, data) {
                if (error) throw new Error(error);
            });
        }
    });
}

module.exports = fetchYoutubeData