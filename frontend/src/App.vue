<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <Navbar/>

    <!-- Main Content Area -->
    <div class="main-content">
      <router-view /> <!-- Current page content will render here -->
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>

<style>


/* App Container */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar on top */
  height: 100%;
  padding: 0px;
}

/* Main Content Area Styles */
.main-content {
  margin-top: 80px;
  display: flex; /* Flexbox for layout */
}
</style>
