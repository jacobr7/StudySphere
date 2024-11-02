<template>
  <div class="container d-flex justify-content-center align-items-center bg-cover" style="min-height: calc(100vh - 80px);">
    <div class="card shadow" style="width: 400px;">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Create an Account</h1>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              class="form-control"
              placeholder="Enter your email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              class="form-control"
              placeholder="Enter your password"
              v-model="password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "../firebase.js"; // Adjust this path
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'; // Import router

const email = ref("");
const password = ref("");
const router = useRouter(); // Get a reference to your Vue router

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Successfully registered!");
      console.log(auth.currentUser);
      router.push('/');
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>

<style scoped>
/* Additional styles can go here if needed */
  .bg-cover {
    background: url('../assets/background.jpg') no-repeat center center fixed;
    background-size: cover;
}
</style>
