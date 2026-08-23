import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAMVMAwc3k-MEFnnEOLvxyJfEnesWVrC-w",
    authDomain: "citycare-c2642.firebaseapp.com",
    projectId: "citycare-c2642",
    storageBucket: "citycare-c2642.firebasestorage.app",
    messagingSenderId: "703326046335",
    appId: "1:703326046335:web:7eb39da54ab6f7af8c574a",
    measurementId: "G-NTMHFH6D9C"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


export {
    app,
    auth,
    googleProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
};