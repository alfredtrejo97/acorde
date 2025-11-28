// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCd2PghnjPRmCLbCjLMUiB2pKuFLiM5QUo",
    authDomain: "acorde-853b0.firebaseapp.com",
    projectId: "acorde-853b0",
    storageBucket: "acorde-853b0.firebasestorage.app",
    messagingSenderId: "329799533108",
    appId: "1:329799533108:web:5960abece81ea840880061"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { app, db, auth };