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
            :disabled="isRoomFull(room)"
            @click="joinRoom"
          >
            Room {{ room }} {{ getParticipantCount(room) }}/30
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import { getActiveUserCount} from "../services/Fire.js";

export default {
  components: { Navbar },
  data() {
    return {
      channelNames: ["1", "2", "3"], // Replace with your actual channel names
      participantCounts: {},
      timer: null,
    };
  },
  mounted() {
    this.updateParticipantCounts();
    setInterval(this.updateParticipantCounts, 1000); // Refresh counts every 5 seconds
  },
  methods: {
    async updateParticipantCounts() {
      for (let room of this.channelNames) {
        const count = await getActiveUserCount(room);
        this.participantCounts[room] = count;
      }
    },
    getParticipantCount(roomId) {
      return this.participantCounts[roomId] || 0;
    },
    isRoomFull(roomId) {
      return this.getParticipantCount(roomId) >= 30;
    },
    joinRoom(event) {
      const room = event.target.getAttribute("data-room");
      if (!this.isRoomFull(room)){
        this.$router.push(`/room?room=${room}`);
      } else {
        console.log("Room is full. You cannot join.")
      }
      
    },
  },
};
</script>

<style scoped>
/* Add your lobby-specific styles here */
@import "../assets/styles/lobby.css";
@import "../assets/styles/main.css";
</style>
