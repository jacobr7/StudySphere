// src/services/AgoraService.js
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "6d072dc830584bd79a4ee2f7fc36e9f3"; // Replace with your actual APP_ID

let uid = sessionStorage.getItem("uid");
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
}

let token = null;
let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};


const joinRoomInit = async (roomId = "main") => {
  await client.join(APP_ID, roomId, token, uid);
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
  await client.publish(localTracks);
};

const leaveRoom = async () => {
  await client.leave();
  localTracks.stop();
  localTracks.close();
  window.location = "/lobby";
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
