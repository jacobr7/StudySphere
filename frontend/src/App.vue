<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-links">
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/notesharing">NoteSharing</router-link>
        <router-link class="nav-link" to="/other">Other Page</router-link>
      </div>
      <div>
        <router-link class="nav-link" to="/userprofile">Username</router-link>
      </div>
    </nav>

    <!-- Main Content Area -->
    <div class="main-content">
      <router-view /> <!-- Current page content will render here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Basic Reset */
body, html {
  margin: 0;
  height: 100%;
}

/* App Container */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar on top */
  height: 100%;
  padding: 0px;
}

/* Navbar Styles */
#app .navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  position: fixed ; /* Fixed positioning for the navbar */
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000; /* Ensure it stays above other elements */
}

.navbar-links{
  display: flex;
}



.nav-link{
  margin: 20px;
}

/* Main Content Area Styles */
.main-content {
  margin-top: 80px;
  height: calc(100vh - 60px); /* Full height minus navbar height */
  display: flex; /* Flexbox for layout */
}
</style>
