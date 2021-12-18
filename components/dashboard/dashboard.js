import { ViewComponent } from "../view.js";
import router from '../../app.js';



DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let publicPlaylists;

    function addPlayList(containername){
        let listContainer=document.getElementById(containername);
        const output=[];
        songlists.forEach((currentList)=>{
            output.push(`
            <h6><li><a href="#" class="link-dark rounded">${currentList.playlist_name}</a></li></h6>
            `)
        })
        listContainer.innerHTML=output.join('');
    }

    function openTheForm() {
        document.getElementById("popupForm").style.display = "block";
    }
    
    function closeTheForm() {
        document.getElementById("popupForm").style.display = "none";
    }

    function newListPop(){

    }

    function addSongs(){

    }

    function loading(){
        //TODO: need API load playlist feature
    }

    async function loadPublic(){  
        try {
            //try to communicate with public list
            let resp = await fetch('http://localhost:5000/lemon/playlists/public', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //So far 204 no content indicates a successful connection
            if (resp.status === 200) {
                let data = await resp.json();
                console.log(data);
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
            console.log("hello dashboard");
            loadPublic();
            addPlayList("songListName");
            addPlayList("publicListName");

            let userObject = sessionStorage.getItem('authUser');
            let user = (JSON.parse(userObject));

            console.log(userObject);
            console.log(JSON.parse(userObject))
            console.log(`Hello! ${user}`);
            // document.getElementById("addMy").addEventListener("click",newListPop());
            // let modal = document.getElementById('loginPopup');
            // if (event.target == modal) {
            //     closeForm();
            // }

    });
}
}

let songlists=[
    {
        playlist_id : "1111",
        playlist_name : "playlist1",
        description : "This is a playlist of relaxing music",
        access_type : 1,
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
            }
        ]        
    },
    {
        playlist_id : "2222",
        playlist_name : "playlist2",
        description : "This is a playlist of relaxing music",
        access_type : 1,
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
        playlist_name : "playlist3",
        description : "This is a playlist of relaxing music",
        access_type : 1,
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