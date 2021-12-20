import { useState } from "react";

export default function LoginComponent() {
    
    let [accessToken, setAccessToken] = useState(null);

    async function login() {
        console.log("Login invoked");
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const [accessToken, tokenType] = 
        [fragment.get("access_token"), fragment.get("token_type")];

    }
    return(
        <>
    <button onClick={login}>login</button>
    </>
    );
}

//"https://discord.com/api/oauth2/authorize?client_id=918521327130914886&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=token&scope=identify"