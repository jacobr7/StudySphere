<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <img src="../assets/SSLogo.jpeg" alt="App Logo" class="logo" /> <!-- Adjust the path to your logo -->
      <h1 class="app-name">Study Sphere</h1> <!-- Replace with your app's name -->
    </div>

    <div :class="['navbar-links', { open: isMenuOpen }]">

        <!-- Show Link if not logged In -->
        <router-link class="nav-link" @click="closeMenu" to="/register" v-if="!isLoggedIn"> Register </router-link>
        <router-link class="nav-link" @click="closeMenu" to="/sign-in" v-if="!isLoggedIn"> Login </router-link>

        <!-- Show Link if logged In -->
        <router-link class="nav-link" @click="closeMenu" to="/" v-if="isLoggedIn"> Home </router-link>
        <router-link class="nav-link" @click="closeMenu" to="/notesharing" v-if="isLoggedIn"> Notesharing </router-link>
        <router-link class="nav-link" @click="closeMenu" to="/forum" v-if="isLoggedIn"> Forum </router-link>
        <router-link class="nav-link" @click="closeMenu" to="/flashcarddecks" v-if="isLoggedIn"> FlashCard
        </router-link>
        <router-link class="nav-link" @click="closeMenu" to="/video-call" v-if="isLoggedIn"> Video Call </router-link>

      <button class="logout" @click="handleSignOut" v-if="isLoggedIn">Logout</button>
    </div>

    <!-- Burger Icon for smaller screens -->
    <button class="burger-icon" @click="isMenuOpen = !isMenuOpen">
      ☰
    </button>

  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { auth } from "../firebase.js"; // Adjust this path
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(false);
const isMenuOpen = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
    }
    else {
      isLoggedIn.value = false;
    }
  })
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/sign-in");
    isMenuOpen.value = false; // Close menu on sign-out
  })
}

// Close menu on link click
const closeMenu = () => {
  isMenuOpen.value = false;
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

.navbar-brand {
  display: flex;
  align-items: center;
  /* Align logo and name vertically */
}

.logo {
  width: 50px;
  /* Adjust size of the logo */
  height: auto;
  /* Maintain aspect ratio */
  margin-right: 10px;
  /* Space between logo and name */
}

.burger-icon {
  display: none;
}

.app-name {
  margin: 0;
  /* Remove default margin from heading */
  font-size: 24px;
  /* Adjust font size as needed */
}

.navbar-links {
  display: flex;
}

.nav-link {
  margin: 20px;
}

.logout {
  background: linear-gradient(135deg, #444, #666);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  
}

.logout:hover {
  background: linear-gradient(135deg, #666, #888);
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

.logout:active {
  background: #555;
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}


/* Small screens */
@media (max-width: 881px) {
  .navbar-links {
    display: none;
    /* Hide links initially on smaller screens */
    flex-direction: column;
    position: absolute;
    top: 80px;
    right: 0;
    background-color: #333;
    width: 100%;
    text-align: center;
    padding: 10px 0;

  }

  .navbar-links.open {
    display: flex;
    /* Show links when menu is open */
  }

  .burger-icon {
    display: block;
    /* Show burger icon on small screens */
  }

  .nav-link {
    margin: 10px 0;
    /* Adjust spacing for mobile */
  }

}
</style>
