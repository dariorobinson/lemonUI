export function Router(routes) {
    this.navigate = function(routePath) {
        let nextView = routes.filter(route => route.path === routePath).pop();
        if (nextView) {
            nextView.component.render();
        } else {
            console.error(`No route found for provided path: ${routePath}`);
        }
    }
}
