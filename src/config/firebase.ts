// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
