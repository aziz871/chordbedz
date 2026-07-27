import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { App } from './app.js';

const firebaseConfig = {
    apiKey: "AIzaSyA2zrK9GpRep0xDa6c77PBkRxhyl8v_FE_k",
    authDomain: "chordbedz.firebaseapp.com",
    projectId: "chordbedz",
    appId: "1:64812684606:web:e7d3163aeef00717a086f"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const app = new App();
app.init();
