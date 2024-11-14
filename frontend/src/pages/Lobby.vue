<template>
  <div>
    <Navbar />
    <div id="room__lobby__container">
      <div class="bg"></div>
      <div id="rooms__container">
        <div id="rooms__container__header">
          <p>👋 Join Study Room</p>
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
            Room {{ room }} {{ getParticipantCount(room)}}/30
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import Navbar from '../components/Navbar.vue';
import { getActiveUserCount} from "../services/Fire.js";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


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
    const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
              if (user) {
                  this.updateParticipantCounts();
                  setInterval(this.updateParticipantCounts, 5000); // Refresh counts every 5 seconds
              } else {
                  console.log("No user is logged in.");
              }
          });
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
#lobby__room__container{
  position: relative;
  width: 100%;
  height: 100vh;
}

.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #E5E4E2;
}

#rooms__container {
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  background-color: #85D7FF;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}

#lobby__form {
  padding: 2em;
}

#rooms__container__header {
  border-radius: 10px 10px 0 0;
  padding: 10px;
  text-align: center;
  color: white;
  background-color: #85D7FF;
  margin: 0;
  font-size: 18px;
  font-size: 300;
  line-height: 0;
}

p {
  display: block;
  margin-block-start: 1em;
  margin-inline-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
}

#rooms{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

button {
  background-color: #00A3E0;
  border-radius: 8px;
  color: white;
  padding: 1rem;
  gap: 1rem; 
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: none;
}

button:not(:disabled):hover {
  transform: scale(1.10);
  background: #E3F2FD;
  color: #4682B4;
}

button:disabled {
  background: #4682B4;
}



</style>
