<template>
  <div class="stream__actions">
    <button id="camera-btn" class="active" @click="toggleCamera">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z"/>
      </svg>
    </button>
    <router-link id="leave-btn" class="active" @click="leaveRoom(this.roomId)" to="/lobby">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z"/>
      </svg></router-link>
  </div>
</template>

<script>
import { toggleCamera, leaveRoom } from "../services/AgoraService";

export default {
  methods: {
    toggleCamera,
    leaveRoom,
  },
};
</script>

<style scoped>
/* Stream action specific styles */
.stream__actions {
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  border-radius: 8px;
  background-color: #1a1a1a60;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  transform: translateX(-50%)
}

.stream__actions a,
.stream__actions button {
  cursor: pointer;
  background-color: #4682B4;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.stream__actions a svg,
.stream__actions button svg {
  width: 1.5rem;
  height: 1.5rem;
  fill: #00A3E0;
}

.stream__actions a.active,
.stream__actions button.active,
.stream__actions a:hover,
.stream__actions button:hover {
  background-color: #E3F2FD;
}

</style>
