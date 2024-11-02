// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCSTt_BtYR07qzKHm9pBgJ93RARJjt-HNA",
    authDomain: "studysphere-8f8ae.firebaseapp.com",
    projectId: "studysphere-8f8ae",
    storageBucket: "studysphere-8f8ae.appspot.com",
    messagingSenderId: "1043087075619",
    appId: "1:1043087075619:web:10ddd930f52125a0960496",
    measurementId: "G-Q4FTB6VJEC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth

export { auth };