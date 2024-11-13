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
}

/* App Container */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar on top */
  height: 100vh;
  padding: 0px;
}

router-view {
  flex: 1; /* Takes up remaining space */
  margin-top: 80px; /* Push the content below the navbar */
  display: flex; /* Flexbox for layout */
}

.marginstuff{
  margin-top: 80px;
}
</style>
