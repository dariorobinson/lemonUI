import { ViewComponent } from "../view.js";
import router from '../../app.js';



DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {
    this.render = function() {
        console.log("dashboard invoked");

        DashboardComponent.prototype.injectStyleSheet();
        DashboardComponent.prototype.injectTemplate(() => {
            dashboardElement=document.getElementById('dashboard');
    });
}
}

export default new DashboardComponent();