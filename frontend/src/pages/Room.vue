<template>
  <div>
    <Navbar />
    <div class="container" >
      <div id="room__container">
        <section id="stream__container">
          <div id="videos__container">
            <div class="video__container" id="user-container-proxy">
                        <div class="video-player" id="user-proxy">
                          <img class="proxy-img" src="../assets/images/proxy1.jpeg" alt="proxy"/>
                        </div>
                      </div>
                      <div class="video__container" id="user-container-proxy">
                        <div class="video-player" id="user-proxy">
                          <img class="proxy-img" src="../assets/images/proxy2.jpeg" alt="proxy"/>
                        </div>
                      </div>
                      <div class="video__container" id="user-container-proxy">
                        <div class="video-player" id="user-proxy">
                          <img class="proxy-img" src="../assets/images/proxy3.jpeg" alt="proxy"/>
                        </div>
                      </div>
                      <div class="video__container" id="user-container-proxy">
                        <div class="video-player" id="user-proxy">
                          <img class="proxy-img" src="../assets/images/proxy4.jpeg" alt="proxy"/>
                        </div>
                      </div>
          </div>
          <StreamActions />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import StreamActions from "../components/StreamActions.vue";
import { joinRoomInit, leaveRoom } from "../services/AgoraService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js';

const auth = getAuth();

export default {
  components: {
    Navbar,
    StreamActions,
  },
  data() {
    return {
      client: null,
      roomId: new URLSearchParams(window.location.search).get("room") || "main",
    };
  },
  async mounted() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            joinRoomInit(this.roomId, user.uid);
        } else {
            router.push("/sign-in");
        }
        });

        window.addEventListener("beforeunload", this.handleLeaveRoom);
        window.addEventListener("popstate", this.handleLeaveRoom); // Handle browser navigation
  },
  beforeUnmount() {
    // Ensure the user disconnects when the component is destroyed
    this.handleLeaveRoom();
    window.removeEventListener("beforeunload", this.handleLeaveRoom);
    window.removeEventListener("popstate", this.handleLeaveRoom);
  },
  methods: {
    
    async handleLeaveRoom() {
      try {
        await leaveRoom(this.roomId);
        console.log("User disconnected from the room");
      } catch (error) {
        console.error("Error leaving the room:", error);
      }
    },
  },
};
</script>

<style scoped>
.proxy-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

</style>
