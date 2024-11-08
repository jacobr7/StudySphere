<template>
    <nav class="navbar">
    <div class="navbar-brand">
      <img src="../assets/SSLogo.jpeg" alt="App Logo" class="logo" /> <!-- Adjust the path to your logo -->
      <h1 class="app-name">Study Sphere</h1> <!-- Replace with your app's name -->
    </div>
      <div class="navbar-links">
        <!-- Show Link if not logged In -->
        <router-link class="nav-link" to="/register" v-if="!isLoggedIn"> Register </router-link>
        <router-link class="nav-link" to="/sign-in" v-if="!isLoggedIn"> Login </router-link>

        <!-- Show Link if logged In -->
        <router-link class="nav-link" to="/" v-if="isLoggedIn"> Home </router-link>
        <router-link class="nav-link" to="/notesharing" v-if="isLoggedIn"> Notesharing </router-link>
        <router-link class="nav-link" to="/forum" v-if="isLoggedIn"> Forum </router-link>
        <router-link class="nav-link" to="/flashcarddecks" v-if="isLoggedIn"> FlashCard </router-link>
        <router-link class="nav-link" to="/video-call" v-if="isLoggedIn"> Video Call </router-link>
      </div>
      <div v-if="isLoggedIn">
        <button @click="handleSignOut" v-if="isLoggedIn">Sign out</button>
      </div>
    </nav>
  </template>

<script setup>
import { onMounted, ref } from 'vue';
import { auth } from "../firebase.js"; // Adjust this path
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const isLoggedIn = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if(user){
      isLoggedIn.value = true;
    }
    else{
      isLoggedIn.value = false;
    }
  })
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/sign-in");
  })
}
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

.navbar-brand {
  display: flex;
  align-items: center; /* Align logo and name vertically */
}

.logo {
  width: 50px; /* Adjust size of the logo */
  height: auto; /* Maintain aspect ratio */
  margin-right: 10px; /* Space between logo and name */
}

.app-name {
  margin: 0; /* Remove default margin from heading */
  font-size: 24px; /* Adjust font size as needed */
}

.navbar-links {
  display: flex;
}

.nav-link {
  margin: 20px;
}
</style>
