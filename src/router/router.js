import { HomePage } from '../pages/home.js';
import { DetailPage } from '../pages/detail.js';
import { FAQPage } from '../pages/faq.js';
import { AdminPanel } from '../pages/admin.js';

export class Router {
    constructor() {
        this.currentPage = null;
        this.app = document.getElementById('app');
    }

    async init() {
        this.handleRouteChange();
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.navigate(this.getCurrentRoute());
    }

    getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    }

    async handleRouteChange() {
        const route = this.getCurrentRoute();
        
        if (route === '/' || route === '') {
            this.currentPage = new HomePage();
        } else if (route.startsWith('/detail/')) {
            const id = route.split('/')[2];
            this.currentPage = new DetailPage(id);
        } else if (route === '/faq') {
            this.currentPage = new FAQPage();
        } else if (route === '/admin') {
            this.currentPage = new AdminPanel();
        } else {
            this.currentPage = new HomePage();
        }

        await this.currentPage.render();
    }

    navigate(route) {
        window.location.hash = route;
    }
}
