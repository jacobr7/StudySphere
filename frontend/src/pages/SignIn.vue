<template>

    <div class="container-fluid d-flex justify-content-center align-items-center bg-cover">
      <div class="card shadow" style="width: 400px;">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">Sign In</h1>
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
            <p v-if="errMsg" class="text-danger">{{ errMsg }}</p>
            <button type="submit" class="btn btn-primary w-100">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { auth } from "../firebase.js"; // Adjust this path
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const email = ref("");
  const password = ref("");
  const errMsg = ref("");
  const router = useRouter();
  
  const register = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Successfully signed in!");
        console.log(auth.currentUser);
        router.push('/');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errMsg.value = "Incorrect password";
            break;
          default:
            errMsg.value = "Email or password was incorrect";
        }
      });
  }
  </script>
  
  <style scoped>
  /* Additional styles can go here if needed */
  .bg-cover {
    background: url('../assets/background.jpg') no-repeat center center fixed;
    background-size: cover;
    margin : 0;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;  /* Hide any overflow to the right */
}

  </style>
  