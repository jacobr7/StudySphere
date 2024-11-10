<template>
  <div>
    <Header />
    <div class="container">
      <div id="room__container">
        <section id="stream__container">
          <div id="videos__container"></div>
          <StreamActions />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import StreamActions from "../components/StreamActions.vue";
import { joinRoomInit, leaveRoom } from "../services/AgoraService";

export default {
  components: {
    Header,
    StreamActions,
  },
  data() {
    return {
      client: null,
      roomId: new URLSearchParams(window.location.search).get("room") || "main",
    };
  },
  async mounted() {
    try {
      await joinRoomInit(this.roomId);

      // Listen for browser back/forward navigation
      window.addEventListener("popstate", this.handleLeaveRoom);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  },
  beforeUnmount() {
    // Ensure the user disconnects when the component is destroyed
    this.handleLeaveRoom();
    window.removeEventListener("popstate", this.handleLeaveRoom);
  },
  methods: {
    
    async handleLeaveRoom() {
      try {
        await leaveRoom();
        console.log("User disconnected from the room");
      } catch (error) {
        console.error("Error leaving the room:", error);
      }
    },
  },
};
</script>

<style >
@import "../assets/styles/room.css";
@import "../assets/styles/main.css";
</style>
