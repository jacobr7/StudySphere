<template>
  <div id="videos__container"></div>
</template>

<script>
import { joinRoomInit } from "../services/AgoraService";

export default {
  props: {
    roomId: {
      type: String,
      default: "main",
    },
  },
  mounted() {
    joinRoomInit(this.roomId);
  },
};
</script>

<style scoped>
/* Video container specific styles */
</style>
