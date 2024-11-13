// src/services/AgoraService.js
import AgoraRTC from "agora-rtc-sdk-ng";
import { addUserToRoom, removeUserFromRoom , getActiveUserCount} from "./Fire.js";
import { getCurrentUserUid } from '../firebase.js'
import { getAuth  } from 'firebase/auth';

const APP_ID = "6d072dc830584bd79a4ee2f7fc36e9f3"; // Replace with your actual APP_ID

let uid = getCurrentUserUid();
// if (!uid) {
//   uid = String(Math.floor(Math.random() * 10000));
//   sessionStorage.setItem("uid", uid);
// }

let token = null;
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};



const joinRoomInit = async (roomId = "main", uid) => {
  console.log("roomId:" + roomId)
  let user = uid;
  let userCount = getActiveUserCount(roomId);
  console.log('this user count' + userCount)
  console.log("uid:" + user)

  await client.join(APP_ID, roomId, token, uid);
  await addUserToRoom(roomId, uid);

  client.on("user-published", handleUserPublished);
  client.on("user-left", handleUserLeft);

  await joinStream();
};

const joinStream = async () => {
  localTracks = await AgoraRTC.createCameraVideoTrack();
  const playerHTML = `<div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                      </div>`;
  document.getElementById("videos__container").insertAdjacentHTML("beforeend", playerHTML);
  localTracks.play(`user-${uid}`);
  console.log("uid:" + uid)

  await client.publish(localTracks);
};

const leaveRoom = async (roomId = "main") => {
  console.log("roomId:" + roomId) 
  const auth = getAuth();
  const firebaseUid = auth.currentUser ? auth.currentUser.uid : uid; // Use Firebase UID if authenticated
  console.log("uid:" + firebaseUid)

  if (!roomId || typeof roomId !== "string") {
    throw new Error("Invalid roomId: It must be a defined string.");
  }
  if (!firebaseUid || typeof firebaseUid !== "string") {
    throw new Error("Invalid uid: It must be a defined string.");
  }

  try {
    console.log(`User ${firebaseUid} is being removed from room ${roomId}`);
    removeUserFromRoom(roomId, firebaseUid);
    console.log(`User ${firebaseUid} removed from room ${roomId}`);

    // Leave the Agora room
    await client.leave();
    localTracks.stop();
    localTracks.close();
    
  } catch (error) {
    console.error("Error leaving the room:", error);
  }
};


const handleUserPublished = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);

  if (!document.getElementById(`user-container-${user.uid}`)) {
    const playerHTML = `<div class="video__container" id="user-container-${user.uid}">
                          <div class="video-player" id="user-${user.uid}"></div>
                        </div>`;
    document.getElementById("videos__container").insertAdjacentHTML("beforeend", playerHTML);
  }

  if (mediaType === "video") {
    user.videoTrack.play(`user-${user.uid}`);
  }
};

const handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  const container = document.getElementById(`user-container-${user.uid}`);
  if (container) {
    container.remove();
  }
};

const toggleCamera = async (e) => {
  const button = e.currentTarget;
  if (localTracks.muted) {
    await localTracks.setMuted(false);
    button.classList.add("active");
  } else {
    await localTracks.setMuted(true);
    button.classList.remove("active");
  }
};

export { joinRoomInit, joinStream, leaveRoom, toggleCamera };
