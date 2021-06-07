var request = require("request");
const videoData = require("../model/VideoData");
var pageToken = ''

const fetchYoutubeData = async () => {
    try {
        var options = getYoutubeApiOptions();
        request(options, function (error, response, body) {
            if (error) 
                throw new Error(error);
            body = JSON.parse(body)
            setPageToken(body);
            parseResponseAndSave(body);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    fetchYoutubeData
}

function setPageToken(body) {
    pageToken = body.nextPageToken;
}

function parseResponseAndSave(body) {
    for (var i = 0; i < body.pageInfo.resultsPerPage; i++) {
        var snippetData = body.items[i].snippet;
        var thumbnailData = snippetData.thumbnails
        var thumbnailUrls = getThumbNailUrls(thumbnailData);
        var id = body.items[i].id.videoId
        var title = snippetData.title
        var description = snippetData.description
        var publishingDatetime = snippetData.publishedAt
        insertData = prepareInsertData(id, title, description, publishingDatetime, thumbnailUrls);
        videoData.saveDataToCollection(insertData)
    }
}

function prepareInsertData(id, title, description, publishingDatetime, thumbnailUrls) {
    return insertData = {
        video_id: id,
        title: title,
        description: description,
        publishing_datetime: publishingDatetime,
        thumbnail_urls: thumbnailUrls
    };
}

function getThumbNailUrls(thumbnailData) {
    var thumbnailUrls = '';
    var thumbnailUrls = thumbnailUrls + thumbnailData.default.url + ',';
    var thumbnailUrls = thumbnailUrls + thumbnailData.medium.url + ',';
    var thumbnailUrls = thumbnailUrls + thumbnailData.high.url;
    return thumbnailUrls;
}

function getYoutubeApiOptions() {
    return {
        method: 'GET',
        url: 'https://youtube.googleapis.com/youtube/v3/search',
        qs: {
            order: 'date',
            publishedAfter: '2021-06-01T00:00:00Z',
            type: 'video',
            key: 'AIzaSyDD1dhRnHZQPVCpVlagY-1cy5UsHts2yMs',
            part: 'snippet',
            q: 'football',
            pageToken: pageToken
        }
    };
}