# YouTube-API

To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

# Basic Requirements:

- Server should call the YouTube API continuously in background (async) with some interval (say 10 seconds) for fetching the latest videos for a predefined search query and should store the data of videos (specifically these fields - Video title, description, publishing datetime, thumbnails URLs and any other fields you require) in a database with proper indexes.
- A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
- A basic search API to search the stored videos using their title and description.
- Dockerize the project.
- It should be scalable and optimised.

# Bonus Points:

- Add support for supplying multiple API keys so that if quota is exhausted on one, it automatically uses the next available key.
- Make a dashboard to view the stored videos with filters and sorting options (optional)
- Optimise search api, so that it's able to search videos containing partial match for the search query in either video title or description.
    - Ex 1: A video with title *`How to make tea?`* should match for the search query `tea how`


# Reference:

- YouTube data v3 API: [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started)
- Search API reference: [https://developers.google.com/youtube/v3/docs/search/list](https://developers.google.com/youtube/v3/docs/search/list)
    - To fetch the latest videos you need to specify these: type=video, order=date, publishedAfter=<SOME_DATE_TIME>
    - Without publishedAfter, it will give you cached results which will be too old


## Build Instructions
### Simple installation
The commands below, build the complete application using docker-compose
```
docker-compose build
```
```
docker-compose up
```

## SERVER:
- http://localhost:8000

## API:
- http://localhost:8000/getVideos?page=2&limit=5
    - page is the page number
    - limit is to limt the number of records
- http://localhost:8000/search

## CONFIG FILE:
- PORT = 8080
- MONGO_URI = mongodb://mongo:27017/youtube_videos
- VIDEO_FETCH_RATE = 10000 
- YOUTUBE_SEARCH_API_URI = https://youtube.googleapis.com/youtube/v3/search
- YOUTUBE_API_RESPONSE_ORDER = date
- YOUTUBE_API_RESPONSE_TYPE = video
- API_KEY = GOOGLE-API-KEY
- YOUTUBE_API_RESPONSE_SNIPPET = snippet
- YOUTUBE_API_RESPONSE_QUERY = football
- PROPOSED_DATE = 2021-06-03