import SessionUser from "../models/SessionUser";
import { appClient } from "./appClient";

const authentication = async(credentials: SessionUser) => {
    let resp = await appClient.post("/auth", credentials);
    if(resp.status == 401) {
        throw resp.data;
    }
    if (resp.status == 204) {
        console.log("authentication successful");
        
    }
}