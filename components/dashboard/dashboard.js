import { ViewComponent } from "../view.js";
import { Router } from "../../util/router.js";
import router from '../../app.js';


// TODO: 

// For both of the following, the buttons should be rendered after getting a valid call to the API 
// (specifically for the users_playlist roll = our wanted value)
// 1) Create a button that only appears if a user is in a playlist they created/ have editing rights for
// This button should then pull up a pop up menu that lets them add songs. This also means not all users will be able to edit public
// playlists.

// 2) Create a button that only appears for the creators of playlists to add users to that playlist. (Remember to float the label and button right)

// 3) Make it to where public and private playlists can be collapsed/expanded in the nav bar on the left

// 4) Update playlists from the API when songs are added/removed

// -------------------------------------------------------------5) Pull playlists from the API

// --------------------------------------------------------------6) Display the private playlists that belong to a user from the API with the proper role features
//(OVERLAPS WITH EARLIER GOALS)

// 7) Playlist deletion (Creators only)

// 8) Make it to where adding a song is simplified to adding a song with just a URL, which then gets pushed through youtube's API
//  to get the title + duration and push them as a new song to the LemonAPI

// 9) Playing playlists from the API on the bot itself

//---------------------------------------------------------------10) Display the playlist ID to make it easier for the discord bot to interface.



// Bonus goals
// 1) Moving everything out of dashboard into different components for clarity
// 2) Pagination for playlist songs 
// 3) Create playlists from the bot in discord (Essentially pushing the queue to the server)

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let publicPlaylists;
    let privatePlaylists;
    let selectedPlaylist;
    //display component variables
    let addNewListBtn;
    let closeNewListBtn;
    let submitNewListBtn;
    let popupNewList;
    let addNewSongBtn;
    let closeNewSongBtn;
    let submitNewSongBtn;
    let popupNewSong;

    // Button for logout
    let logoutLink;

    let publicListBtn;
 
    //input field variables

    // User declaration
    let varUser = window.sessionStorage.getItem('authUser');
    
    let user = (JSON.parse(varUser));

    function updateErrorMessage(errorMsg) {
        console.log('updateErrorMessage invoked');
        console.log(errorMsg);
    }

    //Getting Session Username and display on sidebar
    function setUsername(username){
        let usernameTag=document.getElementById("username");
        usernameTag.innerHTML=username;
    }
  

    //Modularize adding event listener process
    function buttonSetting(){
        //List button fetching API to get playlists
        publicListBtn=document.getElementById("PublicListBtn");
        publicListBtn.addEventListener("click",loadPublic);


        //For adding new playlist pop up
        addNewListBtn=document.getElementById("addMyBtn");
        addNewListBtn.addEventListener("click",newListPop);
        closeNewListBtn=document.getElementById("newListClose");
        closeNewListBtn.addEventListener("click",newListHide);
        submitNewListBtn=document.getElementById("submitNewListBtn");
        submitNewListBtn.addEventListener("click",addNewPlaylist);


        //For adding new song pop up
        addNewSongBtn=document.getElementById("addNewSongsBtn");
        addNewSongBtn.addEventListener("click",newSongPop);
        closeNewSongBtn=document.getElementById("newSongClose");
        closeNewSongBtn.addEventListener("click",newSongHide);
        submitNewSongBtn=document.getElementById("submitNewSongBtn");
        submitNewSongBtn.addEventListener("click",addSongs);

        // For logging out of the current user
        logoutLink = document.getElementById("logoutClick");
        logoutLink.addEventListener("click", logout);
           
    }

    //__________________Button Event Section_____________________
    function newListHide() {
        popupNewList=document.getElementById("addToMyList");
        popupNewList.style.display='none';
    }

    function newListPop(){
        popupNewList=document.getElementById("addToMyList");
        popupNewList.style.display='block';
    }
    function newSongHide() {
        popupNewSong=document.getElementById("addSongs");
        popupNewSong.style.display='none';
    }

    function newSongPop(){
        if(selectedPlaylist){
            popupNewSong=document.getElementById("addSongs");
            popupNewSong.style.display='block';
        }
    }

    // __________________Logout button________________
    function logout() {
        console.log("Clearing the session, logging out!");
        window.sessionStorage.clear();
        window.history.replaceState({}, document.title, "/" + "login.html");
        router.navigate('/login');
        return;
    }

    //_____________Song Functionality_______________
    async function getYTData(url){


        // First do a YT search in order to get the video's title
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/search',
            data: {
                key: 'AIzaSyAfCwtkvz55dNMTBE0uGiGitaMdRf9Erjg',
                q: url,
                maxResults: 1,
                type: 'video'
            },
            success: function(data){
                songDetails = getDuration(data);
                songData = {title:songDetails.title, duration:songDetails.duration, url:url};
                console.log(songData);
                return songData;
            },
            error: function(response){
                console.log("Request to pull youtube search failed...");
            }
        })
    }

    function getDuration(titleData){
        //let respo = await fetch()
        // Take the data from the previous search and use it to get the duration
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/videos',
            data: {
                key: 'AIzaSyAfCwtkvz55dNMTBE0uGiGitaMdRf9Erjg',
                id: titleData.items[0].id,
                part: contentDetails
            },
            success: function(data){
                // Const to hold the values we care about
                console.log(data.items[0].contentDetails.duration);
                songDetails = {title:titleData.items[0].snippet.title, duration:data.items[0].contentDetails.duration};
                console.log(songDetails);
                return songDetails;
            },
            error: function(response){
                console.log("Request to pull youtube video failed...");
            }
        })
    }


    function addSongs(){
        console.log("adding in progress....")
        // let newSongNameField = document.getElementById('NewSongNameInput');
        // let newSongName=newSongNameField.value;
        // let newDurationField=document.getElementById('NewDurationInput');
        // let newDuration=newDurationField.value;
        let newURLField=document.getElementById("NewSongURLInput");
        let newURL=newURLField.value;
        
        // if(newURL){
        //     let exist=false;
            //check if playlist name occupied
            selectedPlaylist.songs.forEach((a)=>{if(a.song_url==newURL)exist=true;});
            if(!exist){
                    console.log(selectedPlaylist);
                    let newSong = getYTData(newURL);
                    selectedPlaylist.songs.push(
                        {
                            song_url:newSong.url,
                            song_name: newSong.title,
                            duration: newSong.duration
                        }
                    );
                    loadSongs();                
                }      
            // }
            popupNewSong=document.getElementById("addSongs");
            popupNewSong.style.display='none';
        
    }


    async function loadSongs(){
        try {
            //try to communicate with public list
            let resp = await fetch(`http://localhost:5000/lemon/playlists/${selectedPlaylist.id}/getsongs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            if (resp.status === 200) {
                let data = await resp.json();
                selectedPlaylist.songs=data;
                console.log("here is the private list "+data);
            }
        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }
        console.log("loading songs");
        //display Name
        let listN=document.getElementById("playlistname");
        listN.innerHTML=selectedPlaylist.name+" id : "+selectedPlaylist.id;
        //DOM target of song table
        let songsContainer=document.getElementById('PlaylistTable').getElementsByTagName('tbody')[0];
        console.log(songsContainer);
        const output=[];
        selectedPlaylist.songs.forEach((a)=>{
            output.push(`
            <tr>
                <td>${a.name}</td>
                <td>${a.duration}</td>
                <td>${a.url}</td>
                <td><ion-icon name="close-outline"></ion-icon></td>
            </tr>
            
            `)
        });
        songsContainer.innerHTML=output.join('');
    }


    // ___________________________________ PLAYLIST LOGIC ______________________________________________

    //Take a playlist[] and a target HTML playlist container to display all available playlists
    function loadPlayList(containername, sourceList){
        let listContainer=document.getElementById(containername);
        const output=[];
        sourceList.forEach((currentList)=>{
            output.push(`
            <li><h6><a href="#" class="link-dark rounded playlist-item" >${currentList.name}</a></h6></li>
            `)})
        listContainer.innerHTML=output.join('');
        //add Event Listener to every playlist name
        listContainer.addEventListener('click', e => {
            // Obtain the target of the click event from the Event object
            let eventTarget = e.target;
            console.log(eventTarget.innerHTML);
            // assign selectedPlaylist for display
            sourceList.forEach((e)=>{
                    if(e.name==eventTarget.innerHTML){selectedPlaylist=e;}
                });
            loadSongs();
        });
    }

    //Add and submit new playList
    async function addNewPlaylist(){
        console.log("adding in progress....");
        //Getting fields of the pop up form
        let newPlaylistnameField = document.getElementById('NewListNameInput');
        let newListName=newPlaylistnameField.value;
        let newPlaylistDescriptionField=document.getElementById('DescriptionInput');
        let newListDescription=newPlaylistDescriptionField.value;
        let newAccessField = document.querySelector('input[type=checkbox]');
        let newAccess="PRIVATE";
        if(newAccessField.checked){
            console.log("Works");
            newAccess="PUBLIC";
        }
        console.log("playlistname: "+newListName+" - description"+newListDescription);
        //Check if key info:newListName occur
        if(newListName){
            let exist=false;
            let tempList={
                name: newListName,
                description: newListDescription,
                access: newAccess
            }
            try {

                let resp = await fetch('http://localhost:5000/lemon/playlists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token
                    },
                    body: JSON.stringify(tempList)
                })
                if (resp.status === 201) {
                    let data=await resp.json();
                    if(newAccess=="PRIVATE"){
                        privatePlaylists.push(
                            {
                                playlist_id : data.id,
                                name : newListName,
                                description : newListDescription,
                                access_type : newAccess,
                                songs:[]
                            }
                        )
                        loadPrivate();
                    }    
                    else{
                        publicPlaylists.push(
                            {
                                playlist_id : data.id,
                                name : newListName,
                                description : newListDescription,
                                access_type : newAccess,
                                songs:[]
                            }
                        )
                        loadPublic();
                    }                       
                }
            } catch (e) {
                console.error(e);
                updateErrorMessage('Connection error!');
            }         
            }
            else {
                updateErrorMessage('Playlist with that name already exists!');
            }      
        popupNewList=document.getElementById("addToMyList");
        popupNewList.style.display='none';
    }
    // ________________ Private Playlists ____________________
    async function loadPrivate(){
        try {
            //try to communicate with public list
            let resp = await fetch('http://localhost:5000/lemon/playlists/private', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            if (resp.status === 200) {
                let data = await resp.json();
                privatePlaylists=data;
                console.log("here is the private list "+privatePlaylists);
                loadPlayList("privateListName",privatePlaylists);
            }
        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }
    }


    // _______________ Public Playlists ___________________
    async function loadPublic(){  
        console.log("loading public playlist");
        console.log(user.token);
        try {
            //try to communicate with public list
            let resp = await fetch('http://localhost:5000/lemon/playlists/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            if (resp.status === 200) {
                let data = await resp.json();
                console.log("here is the public list "+data);
                publicPlaylists=data;
                console.log(publicPlaylists);
                loadPlayList("publicListName",publicPlaylists);
            }
        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }

    }


    this.render = function() {
        if (!window.sessionStorage.getItem("authUser")){
            console.log("Navigating to logout?");
            router.navigate('/login');
            return;
            
        }
        console.log("dashboard invoked");
        varUser = window.sessionStorage.getItem('authUser');
        user = (JSON.parse(varUser));
        console.log("Auth user fetched!");
        DashboardComponent.prototype.injectStyleSheet();
        DashboardComponent.prototype.injectTemplate(() => {
            // NavbarComponent.render();
            console.log("hello dashboard");

            
            setUsername(user.username);
            loadPrivate();
            //Button Setting
            buttonSetting();
        });
        
    }
}

export default new DashboardComponent();