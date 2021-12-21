import { ViewComponent } from "../view.js";
import NavbarComponent from "../navbar/navbar.js";



DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let publicPlaylists;
    //display component variables
    let addNewListBtn;
    let closeNewListBtn;
    let submitNewListBtn;
    let popupNewList;
    let addNewSongBtn;
    let closeNewSongBtn;
    let submitNewSongBtn;
    let popupNewSong;

    let selectedPlaylist;
    //input field variables

    // User declaration
    let varUser = window.sessionStorage.getItem('authUser');


    //Getting Session Username and display on sidebar
    function setUsername(username){
        let usernameTag=document.getElementById("username");
        usernameTag.innerHTML=username;
    }
  

    //Modularize adding event listener process
    function buttonSetting(){
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


    function addSongs(){
        console.log("adding in progress....")
        let newSongNameField = document.getElementById('NewSongNameInput');
        let newSongName=newSongNameField.value;
        let newDurationField=document.getElementById('NewDurationInput');
        let newDuration=newDurationField.value;
        let newURLField=document.getElementById("NewSongURLInput");
        let newURL=newURLField.value;
        
        if(newURL){
            let exist=false;
            //check if playlist name occupied
            selectedPlaylist.songs.forEach((a)=>{if(a.song_url==newURL)exist=true;});
            if(!exist){
                    console.log(selectedPlaylist);
                    selectedPlaylist.songs.push(
                        {
                            song_url:newURL,
                            song_name: newSongName,
                            duration: newDuration
                        }
                    );
                    loadSongs();                
                }      
            }
            popupNewSong=document.getElementById("addSongs");
            popupNewSong.style.display='none';

    }

    function loadSongs(){
        console.log("loading songs");
        let listN=document.getElementById("playlistname");
        listN.innerHTML=selectedPlaylist.name;
        let songsContainer=document.getElementById('PlaylistTable').getElementsByTagName('tbody')[0];
        console.log(songsContainer);
        const output=[];
        selectedPlaylist.songs.forEach((a)=>{
            output.push(`
            <tr>
                <td>${a.song_name}</td>
                <td>${a.duration}</td>
                <td>${a.song_url}</td>
            </tr>
            `)
        });
        songsContainer.innerHTML=output.join('');
    }


    //Take a playlist[] and a target HTML playlist container to display all available playlists
    function loadPlayList(containername, sourceList){
        let listContainer=document.getElementById(containername);
        const output=[];
        sourceList.forEach((currentList)=>{
            output.push(`
            <li><h6><a href="#" class="link-dark rounded">${currentList.name}</a></h6></li>
            `)})
        listContainer.innerHTML=output.join('');
        //add Event Listener to every playlist name
        listContainer.addEventListener('click', e => {
            // Obtain the target of the click event from the Event object
            let eventTarget = e.target;
            console.log(eventTarget.innerHTML);
            // assign selectedPlaylist for display
            songlists.forEach((e)=>{
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
        //assign the date as temp id;
        let newListId=Date.now().toString();
        console.log("playlistname: "+newListName+" - description"+newListDescription);
        //Check if key info:newListName occur
        if(newListName){
            let exist=false;
            let tempList={
                name: newListName,
                description: newListDescription,
                access: "PUBLIC"
            }
            //check if playlist name occupied
            songlists.forEach((a)=>{if(a.name==newListName)exist=true;});
            if(!exist){ 
                try {

                    let resp = await fetch('http://localhost:5000/lemon/playlists', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': varUser.token
                        },
                        body: JSON.stringify(tempList)
                    })
                    if (resp.status === 201) {
                        console.log("OK");
                        songlists.push(
                            {
                                playlist_id : newListId,
                                name : newListName,
                                description : newListDescription,
                                access_type : 1,
                                songs:[]
                            }
                        )
                        console.log(songlists);     
                        loadPlayList("songListName",songlists);                         
                    }
                } catch (e) {
                    console.error(e);
                    updateErrorMessage('Connection error!');
                }         
            }
            else {
                updateErrorMessage('Playlist with that name already exists!');
            }      
        }
        popupNewList=document.getElementById("addToMyList");
        popupNewList.style.display='none';
    }


    async function loadPublic(){  
        console.log("loading public playlist");
        try {
            //try to communicate with public list
            let resp = await fetch('http://localhost:5000/lemon/playlists/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (resp.status === 202) {
                let data = await resp.json();
                console.log("here is the public list "+data);
                let publicPlaylists=data;
                console.log(publicPlaylists);
                loadPlayList("publicListName",publicPlaylists);
            }

        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }

    }


    this.render = function() {
        console.log("dashboard invoked");

        DashboardComponent.prototype.injectStyleSheet();
        DashboardComponent.prototype.injectTemplate(() => {
            // NavbarComponent.render();
            console.log("hello dashboard");
            loadPublic();
            loadPlayList("songListName",songlists);
            let user = (JSON.parse(varUser));
            setUsername(user.username);
            //Button Setting
            buttonSetting();
        });
        
    }
}




//Hard coded sample 
let songlists=[
    {
        playlist_id : "1111",
        name : "playlistTest",
        description : "This is a playlist of relaxing music",
        access: 1,
        songs:[
            {
                song_url:`https://www.youtube.com/watch?v=Rc5D2ubqqIY`,
                song_name: "song1",
                duration: "1:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song2",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song3",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song4",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song5",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song6",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song7",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song8",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song9",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song9",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song10",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song11",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song12",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song13",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song14",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song15",
                duration: "2:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song16",
                duration: "2:30"
            }
        ]        
    },
    {
        playlist_id : "2222",
        name : "playlist2",
        description : "This is a playlist of relaxing music",
        access: 1,
        songs:[
            {
                song_url:`https://www.youtube.com/watch?v=Rc5D2ubqqIY`,
                song_name: "song3",
                duration: "3:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song4",
                duration: "4:30"
            }
        ]   
    },
    {
        playlist_id : "3333",
        name : "playlist3",
        description : "This is a playlist of relaxing music",
        access: 1,
        songs:[
            {
                song_url:`https://www.youtube.com/watch?v=Rc5D2ubqqIY`,
                song_name: "song5",
                duration: "5:30"
            },
            {
                song_url:`https://www.youtube.com/watch?v=5qap5aO4i9A`,
                song_name: "song6",
                duration: "6:30"
            }
        ]   
    }

];




export default new DashboardComponent();