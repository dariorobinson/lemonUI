// Key for youtube API requests
let youtubeKey = 'AIzaSyBOtxA3v2ZiF7uZc854aNvtjznJ-qBezU0';

//_____________Song Functionality_______________
export default async function getYTData(url){
    // Construct an empty details item
    let songDetails;
    let id;
    // First do a YT search in order to get the video's title
    // Construct our request
    const requestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${url}&key=${youtubeKey}`;
    // Create a fetch
    await fetch(requestUrl)
    .then(response => response.json())
    .then(async data => { 
        songDetails = {"title":data.items[0].snippet.title, "duration":undefined};
        id = data.items[0].id.videoId;
    })

    songDetails = {"title":songDetails.title, "duration":await getDuration(id)};
    return songDetails;


}


 async function getDuration(titleId){
    //let respo = await fetch()
    // Take the data from the previous search and use it to get the duration
    let duration;
    // Construct our query
    const requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&maxResults=1&id=${titleId}&key=${youtubeKey}`;

    // Perform a fetch
    await fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        duration = data.items[0].contentDetails.duration;
    })

    return duration;
}