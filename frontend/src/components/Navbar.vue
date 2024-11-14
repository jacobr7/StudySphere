<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link class="nav-link" to="/" v-if="isLoggedIn"><img
        class="logo"
        src="../assets/images/StudySphere.svg"
        alt="Site Logo"
        style="filter: invert(100%) brightness(200%);"
        /></router-link>

      <router-link class="nav-link" to="/" v-if="isLoggedIn"><h1 class="app-name">Study Sphere</h1> </router-link><!-- Replace with your app's name -->
      <router-link class="nav-link" to="/" v-if="!isLoggedIn"><h1 class="intro-app-name">Study Sphere</h1> </router-link>
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
        <router-link class="nav-link" @click="closeMenu" to="/lobby" v-if="isLoggedIn"> Study Rooms </router-link>

      <button class="logout" @click="handleSignOut" v-if="isLoggedIn">Logout</button>
    </div>

    <!-- Burger Icon for smaller screens -->
    <button class="burger-icon" @click="isMenuOpen = !isMenuOpen">
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 18L20 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 12L20 12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 6L20 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
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
  background-color: #85D7FF;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1001;
}

.navbar-brand {
  display: flex;
  position: absolute;
  align-items: center;
  /* Align logo and name vertically */
}

.logo {
  width: 70px;
  /* Adjust size of the logo */
  height: auto;
  /* Maintain aspect ratio */
  margin-right: 10px;
  /* Space between logo and name */
}

.burger-icon {
  display: none;
  margin-left: auto;
  border: 2px solid #fff;
  border-radius: 5px;
  fill: white;
  background: none;
}

.app-name {
  margin: 0;
  /* Remove default margin from heading */
  font-size: 24px;
  /* Adjust font size as needed */
  color:#FFF;
}

.intro-app-name {
  margin: 0;
  /* Remove default margin from heading */
  font-size: 24px;
  /* Adjust font size as needed */
  color:#FFF;
}

.navbar-links {
  margin-left: auto;
}

.navbar-links a {
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: white; /* Adjust text color as needed */
  padding-bottom: 5px;
  margin: 20px;
}

.navbar-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 3px; /* Adjust thickness as needed */
  background: linear-gradient(90deg, #ff7e5f, #feb47b); /* Adjust gradient colors as needed */
  transition: width 0.4s ease; /* Adjust the speed as needed */
}

.navbar-links a:hover::after {
  width: 100%; /* Expands the line to full width only under the hovered link */
}


.logout {
  background: linear-gradient(135deg, #4682B4, #00A3E0);
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
  background: linear-gradient(135deg, #00A3E0, #33BDF2);
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}

.logout:active {
  background: #555;
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}


/* Small screens */
@media (max-width: 955px) {
  .navbar-links {
    display: none;
    /* Hide links initially on smaller screens */
    flex-direction: column;
    position: absolute;
    top: 80px;
    right: 0;
    background-color: #5CBFF9;
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
