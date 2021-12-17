import { Link } from "react-router-dom";
import { useState } from "react";
import SessionUser from "./SessionUser";

export default function Login() {

let tempSessionUser = [
    {
        id: "1234453543543",
        username: "test",
        discriminator: "4312"
    }
]

let [currentSessionUser, updateCurrentSessionUser] = useState(tempSessionUser);
let [sessionUser, updateSessionUser] = useState({});


function addSessionUser(e) {
    e.preventDefault();
    updateCurrentSessionUser([sessionUser, ...currentSessionUser]);
    updateSessionUser({});
}

    return (
        <>
        <a href="https://discord.com/api/oauth2/authorize?client_id=918521327130914886&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=token&scope=identify">Click Me</a>
        </>
        )}
