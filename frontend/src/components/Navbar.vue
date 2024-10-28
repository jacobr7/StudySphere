<template>
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
  </template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
}

.navbar-links {
  display: flex;
}

.nav-link {
  margin: 20px;
}
</style>