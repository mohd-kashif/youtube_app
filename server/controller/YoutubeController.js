var request = require("request");
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
        
        console.log(body);
    });
}

module.exports = fetchYoutubeData