import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);

// Add UID to the activeUsers array in room1
const addUserToRoom = async (room, uid) => {
    const roomRef = doc(db, "rooms", room);
    await updateDoc(roomRef, {
        activeUsers: arrayUnion(uid)
    });
};


// Remove UID from the activeUsers array in room1
const removeUserFromRoom = async (room, uid) => {
    const roomRef = doc(db, "rooms", room);
    console.log("this room " + room)
    await updateDoc(roomRef, {
        activeUsers: arrayRemove(uid)
    });
};



const getActiveUserCount = async (room) => {
    const roomRef = doc(db, "rooms", room);
    const roomSnapshot = await getDoc(roomRef);
    if (roomSnapshot.exists()) {
        const activeUsers = roomSnapshot.data().activeUsers || [];
        return activeUsers.length;
    } else {
        return 0; // Room does not exist or has no users
    }
};

export { addUserToRoom, removeUserFromRoom , getActiveUserCount};
