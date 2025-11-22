import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyDBLkhVPLTjG6eNM1uIKhAL-RnmQO1D758",
    authDomain: "mango-tree-tech.firebaseapp.com",
    projectId: "mango-tree-tech",
    storageBucket: "mango-tree-tech.firebasestorage.app",
    messagingSenderId: "1050056302533",
    appId: "1:1050056302533:web:a072a14c0116138cf2b5ac",
    measurementId: "G-DBPW1ZZNB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics (not exported to avoid unused warning)
getAnalytics(app);

export default app;
