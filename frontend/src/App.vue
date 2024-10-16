<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NoteList from './components/NoteList.vue'
import FileUpload from './components/FileUpload.vue'
</script>

<template>
  <FileUpload/>
  <NoteList/>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
