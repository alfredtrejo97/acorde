// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAur_eYvY-JNpeniaKShYgcGwkBUp5mITE",
    authDomain: "acorde-3c810.firebaseapp.com",
    projectId: "acorde-3c810",
    storageBucket: "acorde-3c810.firebasestorage.app",
    messagingSenderId: "345292867550",
    appId: "1:345292867550:web:6cfac88c3e3d77b722ff4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { app, db, auth };