// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

// Function to get the current user UID
const getCurrentUserUid = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export { auth, getCurrentUserUid };
