import Playlists from "./music/Playlists";
import { useState } from "react";
import Login from "../login/Login";

export default function Dashboard() {

    
  
    let tempPlaylistArr = ["p1", "p2", "p3"];
    //need function to take in sessionUser
    let currentSessionUser = [{}];

    let[playlistArr, updatePlaylistArr] = useState(tempPlaylistArr);
    let[playlist, updatePlaylist] = useState("");
    let[sessionUser, updateSessionUser] = useState({});

    function handleChange(e) {
        updatePlaylistArr(e.target.value);
    }

    function addPlaylist(e) {
        e.preventDefault();
        updatePlaylistArr([playlist, ...playlistArr]);
        updatePlaylist("");
    }

    function getPlaylist() {

    }

    return (
        <>
        <h1>I HATE REACT</h1>
        <form onSubmit = {addPlaylist}>
                <input type = "text" value = {playlist} onChange = {handleChange} />
                <input type = "submit" value = "Add Playlist" />
            </form>
            {/** TODO need to implement a dynamic way of rendering our list of playlists */}
            <ol>
                <Playlists />
                <Playlists />
                <Playlists />
            </ol>
        </>
    );
}