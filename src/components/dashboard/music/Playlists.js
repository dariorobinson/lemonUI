import Songs from "./Songs";
import { useState } from "react";

export default function Playlists() {
    

    let tempPlaylist = ["s1", "s2", "s3"];
    

    let [playlists, updatePlaylist] = useState(tempPlaylist);
    let [song, updateSong] = useState("");

    function handleChange(e) {
        updateSong(e.target.value);
    }

    function addSong(e) {
        e.preventDefault();
        updatePlaylist([song, ...playlists]);
        updateSong("");
    }
    
    return (
        <>
            <form onSubmit = {addSong}>
                <input type = "text" value = {song} onChange = {handleChange} />
                <input type = "submit" value = "Add Song" />
            </form>
            <h3>tempPlaylist's Songs</h3>
            <ol>
                {playlists.map((song) => (
                    <Songs song = {song} key = {song} />
                ))}
            </ol>
        </>
    );
}