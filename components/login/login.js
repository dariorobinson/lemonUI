import { ViewComponent } from "../view.js";
import router from '../../app.js';

LoginComponent.prototype = new ViewComponent('login');
function LoginComponent() {

    let loginButtonElement;
    let errorMessageElement;


    function updateErrorMessage(errorMsg) {
        console.log('updateErrorMessage invoked');
        console.log(errorMsg);
    }


    async function Login(){       
        console.log("login invoked");
        //initialize a credential field for login purpose later
        let credentials;
        //parse token information from fragment indentifier
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

        
        //if token missing raise error message
        if (!accessToken) {
            return updateErrorMessage("Authorization Error: No Token founded in fragment");
        }
        //else if token occur: get user information
        try{//connect discord api
            let resp=await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType} ${accessToken}`,
                },
            });
            //obtain repsonse and save credentials
            let result=await resp.json();
            const {id, username, discriminator} = result;
            credentials={"id":id, "username":username,"discriminator":discriminator, "token":undefined};
            console.log([id,username,discriminator]);
        }catch(e){
            updateErrorMessage("Failed to connect Discord!");
        }
        try {
            //Try to connect lemon API for login
            let resp = await fetch('http://localhost:5000/lemon/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })
            //So far 204 no content indicates a successful connection
            if (resp.status === 200) {
                credentials.token = resp.headers.get('Authorization');
                window.sessionStorage.setItem('authUser', JSON.stringify(credentials));
                router.navigate('/dashboard');
            }

        } catch (e) {
            console.error(e);
            updateErrorMessage('Connection error!');
        }
    }

    

    this.render = function() {
        console.log("rendering login page")

        LoginComponent.prototype.injectStyleSheet();
        LoginComponent.prototype.injectTemplate(() => {
            //assign the button to login button 
            loginButtonElement = document.getElementById('login');
            //using bootstrap button class style
            loginButtonElement.setAttribute('class','btn btn-primary');
        });
        Login();

        
        



    }

}

export default new LoginComponent();