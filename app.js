import { Router } from './util/router.js';
// import NavbarComponent from './components/navbar/navbar.js';
import LoginComponent from './components/login/login.js';
import DashboardComponent from './components/dashboard/dashboard.js';

let routes = [
    {
        path: '/login',
        component: LoginComponent
    },
    {
        path: '/dashboard',
        component: DashboardComponent
    }

];

const router = new Router(routes);


window.onload = () => {
    console.log('window loaded');
    router.navigate('/login');
};


export default (() => router)();


