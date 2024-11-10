<template>
  <div>
    <Navbar />
    <main id="room__lobby__container">
      <div id="rooms__container">
        <div id="rooms__container__header">
          <p>👋 Create or Join Room</p>
        </div>
        <div id="rooms">
          <button
            v-for="(room, index) in channelNames"
            :key="index"
            :id="'participantCount' + room"
            class="rooms"
            :data-room="room"
            @click="joinRoom"
          >
            Room {{ room }} 0/30
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
  components: { Navbar },
  data() {
    return {
      channelNames: ["1", "2", "3"], // Replace with your actual channel names
    };
  },
  methods: {
    joinRoom(event) {
      const room = event.target.getAttribute("data-room");
      this.$router.push(`/room?room=${room}`);
    },
  },
};
</script>

<style>
/* Add your lobby-specific styles here */
@import "../assets/styles/lobby.css";
@import "../assets/styles/main.css";
</style>
