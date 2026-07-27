import { Router } from './router/router.js';
import { DarkMode } from './utils/darkMode.js';

export class App {
    constructor() {
        this.router = new Router();
        this.darkMode = new DarkMode();
    }

    async init() {
        this.setupEventListeners();
        this.darkMode.init();
        await this.router.init();
    }

    setupEventListeners() {
        let logoClickCount = 0;
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-logo]')) {
                logoClickCount++;
                if (logoClickCount === 3) {
                    this.router.navigate('/admin');
                    logoClickCount = 0;
                }
                setTimeout(() => logoClickCount = 0, 1000);
            }
        });
    }
}
