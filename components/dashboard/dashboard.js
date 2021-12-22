import { ViewComponent } from "../view.js";
import router from '../../app.js';
import getYTData from "../../util/youtube.js";


// TODO: 

// For both of the following, the buttons should be rendered after getting a valid call to the API 
// (specifically for the users_playlist roll = our wanted value)
// --------------------------------------------------------------1) Create a button that only appears if a user is in a playlist they created/ have editing rights for
// This button should then pull up a pop up menu that lets them add songs. This also means not all users will be able to edit public
// playlists.

// 2) Create a button that only appears for the creators of playlists to add users to that playlist. (Remember to float the label and button right)

// --------------------------------------------------------------3) Make it to where public and private playlists can be collapsed/expanded in the nav bar on the left

// --------------------------------------------------------------4) Update playlists from the API when songs are added/removed

// -------------------------------------------------------------5) Pull playlists from the API

// --------------------------------------------------------------6) Display the private playlists that belong to a user from the API with the proper role features
//(OVERLAPS WITH EARLIER GOALS)

// 7) Playlist deletion (Creators only)

// -------------------------------------------------------------8) Make it to where adding a song is simplified to adding a song with just a URL, which then gets pushed through youtube's API
//  to get the title + duration and push them as a new song to the LemonAPI

// 9) Playing playlists from the API on the bot itself

//---------------------------------------------------------------10) Display the playlist ID to make it easier for the discord bot to interface.



// Bonus goals
// 1) Moving everything out of dashboard into different components for clarity
// 2) Pagination for playlist songs 
// 3) Create playlists from the bot in discord (Essentially pushing the queue to the server)

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    // Playlists
    let publicPlaylists;
    let privatePlaylists;
    let selectedPlaylist;

    //Who can access for selectedPlaylist
    let whoList;

    //___________display component variables_____________
    // adding new list pop up
    let addNewListBtn;
    let closeNewListBtn;
    let submitNewListBtn;
    let popupNewList;
    // adding new song pop up
    let addNewSongBtn;
    let closeNewSongBtn;
    let submitNewSongBtn;
    let popupNewSong;
    // invite user pop up
    let inviteBtn;
    let closeInviteBtn;
    let submitNewInviteBtn;
    let popupNewInvite;
    // edit playlist pop up
    let editBtn;
    let closeEditBtn;
    let submitEditBtn;
    let popupEdit;
    //Who Can Access Btn
    let showAccessBtn;
    //Delete play list Btn
    let deleteBtn;
    //Loading Public list drop down button
    let publicListBtn;


    // Button for logout
    let logoutLink;

    // Key for youtube API requests
    let youtubeKey = 'AIzaSyBOtxA3v2ZiF7uZc854aNvtjznJ-qBezU0';

    

    
    



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

        //Delete List button
        deleteBtn=document.getElementById("delete-Btn");
        deleteBtn.addEventListener("click",deletePlaylist);
        
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
        submitNewSongBtn.addEventListener("click", addSongs);



        // For logging out of the current user
        logoutLink = document.getElementById("logoutClick");
        logoutLink.addEventListener("click", logout);
           
        //For inviting new friend to access the playlist
        inviteBtn=document.getElementById("invite-btn");
        inviteBtn.addEventListener("click",newInvitePop);
        closeInviteBtn=document.getElementById("new-invite-close-btn");
        closeInviteBtn.addEventListener("click",newInviteHide);
        submitNewInviteBtn=document.getElementById("submit-invite-btn");
        submitNewInviteBtn.addEventListener("click",invite);

        //Show who can access buttton
        showAccessBtn=document.getElementById("who-can-access-btn");
        showAccessBtn.addEventListener("click",showAccess);

        //For edit playlist information
        editBtn=document.getElementById("edit-btn");
        editBtn.addEventListener("click",editPop);
        closeEditBtn=document.getElementById("close-edit-btn");
        closeEditBtn.addEventListener("click",editHide);
        submitEditBtn=document.getElementById("submit-edit-btn");
        submitEditBtn.addEventListener("click",editPlaylist);
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
    function newInviteHide() {
        popupNewInvite=document.getElementById("invite-users");
        popupNewInvite.style.display='none';
    }

    function newInvitePop(){
        popupNewInvite=document.getElementById("invite-users");
        popupNewInvite.style.display='block';
    }
    function editHide(){
        popupEdit=document.getElementById("edit-playlist");
        popupEdit.style.display='none';
    }
    function editPop(){
        if(selectedPlaylist){
            popupEdit=document.getElementById("edit-playlist");
            popupEdit.style.display='block';
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
    // Adds a song to the playlist
    async function addSongs(){
        console.log("adding in progress....");
        
        // Get the URL from a user
        let newURLField=document.getElementById("NewSongURLInput");
        let newURL=newURLField.value;
        
        console.log("Still here!");
        // Create a new song from the URL using Youtube's Data API
        let newSong = {"title":undefined, "duration":undefined};
        newSong = await getYTData(newURL);
        console.log("Here's the new song...");

        // Push the song to the playlist if we got a result
        if (newSong){
            let sendSong = {"songUrl": newURL, "name": newSong.title,
                "duration": newSong.duration};
            console.log(sendSong);
            
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/addsong`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                },
                body: JSON.stringify(sendSong)
            });
            if (resp.status === 403) {
                alert("Sorry, you don't have permissions to do that!");
            }
        }
        
        loadSongs();                
        
        // }
        popupNewSong=document.getElementById("addSongs");
        popupNewSong.style.display='none';
        
    }


    async function loadSongs(){
        try {
            //try to communicate with public list
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/getsongs`, {
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
        listN.innerHTML=selectedPlaylist.name;
        /*
        let listId=document.getElementById("playlist-id");
        listId.innerHTML="ID: "+selectedPlaylist.id;
        */
        //DOM target of song table
        let songsContainer=document.getElementById('PlaylistTable').getElementsByTagName('tbody')[0];
        const output=[];
        selectedPlaylist.songs.forEach((a)=>{
            output.push(`
            <tr>
                <td>${a.name}</td>
                <td>${a.duration}</td>
                <td id="url">${a.url}</td>
                <td><button type="button" id="delete-song" class="btn btn-default" ><ion-icon name ="trash-outline"></ion-icon></i></button></td>
            </tr>
            `)
        });
        songsContainer.innerHTML=output.join('');

        
          
    }

    async function addDelete(){
        // Deletion logic
        // When a user clicks the delete button...
        $("#PlaylistTable").on("click", "button", async function(e) {
            // Find the row it's on
            var row = e.currentTarget.closest('tr');

            // Target the name and URL
            var songName = row.getElementsByTagName('td')[0].textContent;
            var delURL = row.getElementsByTagName('td')[2].textContent;

            // Confirm the delete
            var retVal = confirm("Are you sure you want to delete " + songName + "? ");

            // If they confirm it, log it and do it
            if (retVal == true) {
                console.log("User wants to delete: " + songName + " at " + delURL);
                await deleteSong(delURL);
            }
          });
    }

    async function deleteSong(delURL){
        // Turn the url into a structure we can easily turn into a json
        let delTarget = {"songUrl":delURL};
        
        // Perform the API Call
        // Patch, needs 'songUrl'
        let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/removesong`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            },
            body: JSON.stringify(delTarget)
        });
        // Perm check
        if (resp.status === 403) {
            alert("Sorry, you don't have permissions to do that!");
        }

        // Reload the songs and re-add the deletion buttons
        loadSongs();
        addDelete();
    }

    //____________________________________ SOCIAL LOGIC __________________________________________

    async function invite(){
        let inviteUsernameField = document.getElementById("new-invite-username");
        let inviteUsername=inviteUsernameField.value;
        let inviteDiscriminatorField=document.getElementById("new-invite-discriminator");
        let inviteDiscriminator=inviteDiscriminatorField.value;
        let roleTypeField=document.querySelector('input[type=radio]');
        let roleType=roleTypeField.id;
        let newInvite={
            "username": inviteUsername,
            "discriminator": inviteDiscriminator,
        }
        console.log(newInvite);
        try {
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/adduser`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                },
                body: JSON.stringify(newInvite)
                
            });
            if (resp.status === 204) {
                console.log("Successfully added user to access this playlist")
            }
        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }
    }

    async function showAccess(){
        if(selectedPlaylist){
            whoList=undefined;
            console.log("showing Who can Access");
            try {
                let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/getusers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token
                    },                
                });
                if (resp.status === 200) {
                    console.log("data obtained");
                    //Get data and save who can access list as whoList
                    let data= await resp.json();
                    whoList=data;
                    console.log(whoList);
                    //display whoList information on the button drop down
                    let whoDrop=document.getElementById("access-table");
                    const output=[];
                    whoList.forEach((e)=>{
                        output.push(`
                        <li><a href="#" class="dropdown-item" >
                            ${e.username}#${e.discriminator}${e.userRole}
                        </a></li>
                        `)})
                    whoDrop.innerHTML=output.join('');
                }
            } catch (e) {
                console.error(e);
                updateErrorMessage('Connection error!');
            }
        }
    }
    // ___________________________________ PLAYLIST LOGIC ______________________________________________

    //Take a playlist[] and a target HTML playlist container to display all available playlists
    function loadPlayList(containername, sourceList){
        let listContainer=document.getElementById(containername);
        const output=[];
        sourceList.forEach((currentList)=>{
            output.push(`
            <li><h6><a id=${currentList.id} href="#" class="link-dark rounded playlist-item" >${currentList.name}</a></h6></li>
            `)})
        listContainer.innerHTML=output.join('');
        //add Event Listener to every playlist name
        listContainer.addEventListener('click', e => {
            // Obtain the target of the click event from the Event object
            let eventTarget = e.target;
            console.log(eventTarget.innerHTML);
            // assign selectedPlaylist for display
            sourceList.forEach((e)=>{
                    if(e.id==eventTarget.id){selectedPlaylist=e;}
                });
            loadSongs();
            addDelete();
            updateCopy();

        });
    }

    //Delete play list function
    async function deletePlaylist(){
        // Confirm this is what they want to do
        var dodel = confirm("Are you sure you want to delete " + selectedPlaylist.name + "?");
        if (dodel == true){
            try {
                // If so, perform the API Call
                let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.token
                    }
                });
                // On an appropriate call, do the following
                if (resp.status === 204) {
                    //after delete reset selectedPlaylist
                    selectedPlaylist=undefined;
                    //reload playlists
                    loadPrivate();
                    loadPublic();
                    //reload songs table
                    let songsContainer=document.getElementById('PlaylistTable').getElementsByTagName('tbody')[0];
                    songsContainer.innerHTML=null;
                    //clear playlist name and id displayed above the table
                    let listN=document.getElementById("playlistname");
                    listN.innerHTML='';
                    let listId=document.getElementById("playlist-id");
                    listId.innerHTML='';
                }
                if (resp.status = 403){
                    alert("You don't have the permissions to delete " + selectedPlaylist.name + "!");
                }
            } catch (e) {
                console.error(e);
                updateErrorMessage('Connection error!');
            }
        }
    }
    //Edit Playlist Information
    async function editPlaylist(){
        let editNameField=document.getElementById("edit-playlist-name");
        let editName=editNameField.value;
        let editDescriptionFeild=document.getElementById("edit-playlist-description");
        let editDescription=editDescriptionFeild.value;
        console.log(selectedPlaylist);
        console.log(selectedPlaylist.access);
        let newInfo={
            name: editName,
            description: editDescription,
            access:selectedPlaylist.access
        }
        try {
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/${selectedPlaylist.id}/editplaylist`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                },
                body:JSON.stringify(newInfo)
            });
            if (resp.status === 200) {
                console.log("Edit Done");
                loadPrivate();
                let songsContainer=document.getElementById('PlaylistTable').getElementsByTagName('tbody')[0];
                songsContainer.innerHTML=null;
                //clear playlist name and id displayed above the table
                let listN=document.getElementById("playlistname");
                listN.innerHTML='';
            }
            else{
                alert("You Don't have Access to do this action");
            }
        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }
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

                let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists`, {
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

    function updateCopy(){
        $("#buttonRow").on("click", "button", async function(e) {
            var btn = e.currentTarget;
            if (btn.id == "share-list"){
                
                if (selectedPlaylist.id)
                {
                    // Give the user the current playlists' ID in their clipboard
                    navigator.clipboard.writeText(selectedPlaylist.id);
                    alert("Copied ID to clipboard!");
                }
                
            }
            
          });
    }
    
    // ________________ Private Playlists ____________________
    async function loadPrivate(){
        try {
            //try to communicate with public list
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/private`, {
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
            let resp = await fetch(`${lemonAPIEndpoint}/lemon/playlists/public`, {
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
        // First things first, do we have a user?
        if (!window.sessionStorage.getItem("authUser")){
            // If not, go log them in
            console.log("Navigating to logout");
            router.navigate('/login');
            return;
        }
        console.log("dashboard invoked");

        // If they just logged in, then we need to change the authUser and user to reflect the new login
        varUser = window.sessionStorage.getItem('authUser');
        user = (JSON.parse(varUser));
        console.log("Auth user fetched!");

        // Create our dashboard
        DashboardComponent.prototype.injectStyleSheet();
        DashboardComponent.prototype.injectTemplate(() => {
            console.log("hello dashboard");

            // Show our username, and the playlists available!
            setUsername(user.username);
            loadPrivate();
            //Button Setting
            buttonSetting();
        });
        
    }

}

export default new DashboardComponent();