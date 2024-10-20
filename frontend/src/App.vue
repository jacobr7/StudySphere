<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NoteList from './components/NoteList.vue'
import FileUpload from './components/FileUpload.vue'
</script>

<template>
  <!--
  <FileUpload/>
  <NoteList/>
  <HelloWorld msg="Vite + Vue" />
  -->

  <!-- Navigation links using <router-link> for smooth routing -->

  <router-link to="/" class="nav-link">Home</router-link> |
  <router-link to="/about" class="nav-link">About</router-link>

  <!-- router-view is where the current page component will render -->
  <router-view />

</template>

<script>
export default {
  name: 'App',
};
</script>

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
