<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <!-- <Navbar/> -->
    <Navbar/>

    <!-- Main Content Area -->
    <div class="marginstuff"> 
      <router-view /> <!-- Current page content will render here -->
    </div> 
      
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
/* for scroll bar on all pages*/
body {
    overflow-y: auto;
    margin: 0;
    padding: 0;
    height: 100%;
}

/* App Container */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar on top */
  height: 100vh;
  padding: 0px;
}

.marginstuff{
  margin-top: 80px;
  flex-grow: 1; /* Make this take up the remaining height */
  overflow-y: auto; /* Allow scrolling within this content area */
  display: flex;
  flex-direction: column;
}
</style>
