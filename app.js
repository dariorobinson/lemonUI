import { Router } from './util/router.js';
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
    router.navigate('/dashboard');
};


export default (() => router)();


