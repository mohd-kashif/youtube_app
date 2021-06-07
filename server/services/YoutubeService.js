var request = require("request");
const videoData = require("../model/VideoData");
const moment= require('moment') 
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
    var datePublishedAfter = getDatePublishedAfter();
    return {
        method: 'GET',
        url: process.env.YOUTUBE_SEARCH_API_URI,
        qs: {
            order: process.env.YOUTUBE_API_RESPONSE_ORDER,
            publishedAfter: datePublishedAfter,
            type: process.env.YOUTUBE_API_RESPONSE_TYPE,
            key: process.env.API_KEY,
            part: process.env.YOUTUBE_API_RESPONSE_SNIPPET,
            q: process.env.YOUTUBE_API_RESPONSE_QUERY,
            pageToken: pageToken
        }
    };
}

function getDatePublishedAfter() {
    var datePublishedAfter = '';
    var localTime = moment().format('YYYY-MM-DD');
    var proposedDate = process.env.PROPOSED_DATE;
    if (proposedDate > localTime) {
        datePublishedAfter = localTime;
    }
    else {
        datePublishedAfter = proposedDate;
    }
    datePublishedAfter = datePublishedAfter + "T00:00:00.000Z";
    return datePublishedAfter;
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchVideosData = (videoTitle) => {
    const query = createSearchQuery(videoTitle)
    const options = createOptionsForQuery();
    var result = videoData.getSearchQueryResult(query, options)
    return result
}

const getVideos = (limit, skipIndex) => {
    const query = {}
    const options = createOptionsForQuery();
    var result = videoData.getAllVideos(query, options, limit, skipIndex)
    return result
}

function createOptionsForQuery() {
    return {
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
}

function createSearchQuery(videoTitle) {
    return {
        $or: [{
            'title': new RegExp(escapeRegex(videoTitle), 'i')
        }, {
            'description': new RegExp(escapeRegex(videoTitle), 'i')
        }]
    };
}

module.exports = {
    fetchYoutubeData,
    searchVideosData,
    getVideos
}