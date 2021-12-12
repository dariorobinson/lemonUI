import { Router } from './util/router.js';
//import NavbarComponent from './components/navbar/navbar.js';
import LoginComponent from './components/login/login.js';

let routes = [
    {
        path: '/login',
        component: LoginComponent
    },
];

const router = new Router(routes);


window.onload = () => {
    console.log('window loaded');

    router.navigate('/login');
};


export default (() => router)();


