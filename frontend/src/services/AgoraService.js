// src/services/AgoraService.js
import AgoraRTC from "agora-rtc-sdk-ng";
import { getActiveUserCount, addUserToRoom, removeUserFromRoom } from "./Fire.js";
import { getCurrentUserUid } from '../firebase.js';
import { getAuth } from 'firebase/auth';
import router from '../router';

const APP_ID = "fde7a37293e245f2b8e7338b067e1a92"; // Replace with your actual APP_ID

let uid = getCurrentUserUid();
let token = null;
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
let localTracks = [];
let remoteUsers = {};


const joinRoomInit = async (roomId = "main", uid) => {
  console.log("roomId:" + roomId);

  // Check the number of users in the database for the room
  try {
    const userCount = await getActiveUserCount(roomId); // Assume this function returns the current user count
    console.log(`Current user count in room ${roomId}: ${userCount}`);

    // If the room is full, redirect to the lobby
    if (userCount >= 30) {
      console.log("Room is full, redirecting to the lobby.");
      router.push("/lobby"); // Redirect to the lobby
      return; // Exit the function to prevent further execution
    }
  } catch (error) {
    console.error("Error checking user count:", error);
    return; // Exit if there's an error fetching the count
  }

  // Proceed to join the room if it's not full
  let user = uid;
  await client.join(APP_ID, roomId, token, uid);
  await addUserToRoom(roomId, uid);

  // Subscribe to existing users
  client.remoteUsers.forEach(async (existingUser) => {
    if (existingUser.videoTrack) {
      await client.subscribe(existingUser, "video");
      console.log(`Subscribed to existing user: ${existingUser.uid}`);

      if (!document.getElementById(`user-container-${existingUser.uid}`)) {
        const playerHTML = `<div class="video__container" id="user-container-${existingUser.uid}">
                              <div class="video-player" id="user-${existingUser.uid}"></div>
                            </div>`;
        document.getElementById("videos__container").insertAdjacentHTML("beforeend", playerHTML);
      }

      existingUser.videoTrack.play(`user-${existingUser.uid}`);
    }
  });

  client.on("user-published", handleUserPublished);
  client.on("user-unpublished", handleUserUnpublished);
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

  await client.publish(localTracks);
};

const leaveRoom = async (roomId = "main") => {
  const auth = getAuth();
  const firebaseUid = auth.currentUser ? auth.currentUser.uid : uid;

  if (!roomId || typeof roomId !== "string") {
    throw new Error("Invalid roomId: It must be a defined string.");
  }
  if (!firebaseUid || typeof firebaseUid !== "string") {
    throw new Error("Invalid uid: It must be a defined string.");
  }

  try {
    console.log(`User ${firebaseUid} is being removed from room ${roomId}`);
    removeUserFromRoom(roomId, firebaseUid);

    // Leave the Agora room
    await client.leave();
    localTracks.stop();
    localTracks.close();
  } catch (error) {
    console.error("Error leaving the room:", error);
  }
};

const handleUserPublished = async (user, mediaType) => {
  if (mediaType !== "video") return; // Skip handling audio streams

  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  console.log(`Subscribed to video of user: ${user.uid}`);

  if (!document.getElementById(`user-container-${user.uid}`)) {
    const playerHTML = `<div class="video__container" id="user-container-${user.uid}">
                          <div class="video-player" id="user-${user.uid}"></div>
                        </div>`;
    document.getElementById("videos__container").insertAdjacentHTML("beforeend", playerHTML);
  }

  user.videoTrack.play(`user-${user.uid}`);
};

const handleUserUnpublished = (user, mediaType) => {
  if (mediaType !== "video") return; // Only handle video unpublishing
  console.log(`User ${user.uid} unpublished video`);

  const container = document.getElementById(`user-container-${user.uid}`);
  if (container) {
    container.remove();
  }
};

const handleUserLeft = (user) => {
  console.log(`User ${user.uid} has left the room`);
  delete remoteUsers[user.uid];
  const container = document.getElementById(`user-container-${user.uid}`);
  if (container) {
    container.remove();
  }
};

// Toggle camera functionality
const toggleCamera = async (e) => {
  const button = e.currentTarget;
  if (localTracks.muted) {
    await localTracks.setMuted(false);
    button.classList.add("active");
    console.log("Camera turned on");
  } else {
    await localTracks.setMuted(true);
    button.classList.remove("active");
    console.log("Camera turned off");
  }
};

export { joinRoomInit, joinStream, leaveRoom, toggleCamera };
