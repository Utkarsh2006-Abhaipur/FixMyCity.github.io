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
    apiKey: "AIzaSyDU1F5eJplYnQ7HrIBcxvK3jA3ZMECyq2w",
    authDomain: "civicissuereporter-2fa6d.firebaseapp.com",
    projectId: "civicissuereporter-2fa6d",
    storageBucket: "civicissuereporter-2fa6d.firebasestorage.app",
    messagingSenderId: "1008677836126",
    appId: "1:1008677836126:web:1b1660f450d8d6657aabcf"
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