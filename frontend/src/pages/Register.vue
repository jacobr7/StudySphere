<template>
  <div class="container-fluid d-flex justify-content-center align-items-center vh-100 bg-cover">
    <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
      <div class="text-center mb-3">
        <!---->
        <img src="../assets/images/StudySphere.svg" alt="Logo" class="img-fluid" style="max-width: 100px;">
        <!---->
      </div>
      <h3 class="text-center mb-4">Create a User Account</h3>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" class="form-control" v-model="username" placeholder="Enter Username" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" class="form-control" v-model="email" placeholder="Enter Email" required>
          <div class="text-danger">{{ emailError }}</div> <!-- Display email error message here -->
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" class="form-control" v-model="password" placeholder="Enter Password" required>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" placeholder="Confirm Password" required>
        </div>
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" id="agree" v-model="agree" required>
          <label class="form-check-label" for="agree">I agree with the <a href="#">Terms of Service</a></label>
        </div>

        <div class="text-danger">{{ errorMessage }}</div>
        <div class="text-success">{{ successMessage }}</div>

        <button type="submit" class="btn btn-success btn-block">Sign Up</button>
      </form>
      <div class="text-center mt-3">
        <router-link to="/sign-in">Already a Member?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
      errorMessage: "",
      successMessage: "",
      emailError: "",
      loading: false // Add loading state
    };
  },
  methods: {
    validateEmail() {
      if (!this.email.endsWith("smu.edu.sg")) {
        this.emailError = "Please use your school email";
        return false;
      }
      this.emailError = "";
      return true;
    },
    async register() {
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true; // Set loading to true at the start of registration

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        this.loading = false; // Stop loading if there's an error
        return;
      }

      if (!this.agree) {
        this.errorMessage = "You must agree to the Terms of Service.";
        this.loading = false; // Stop loading if there's an error
        return;
      }

      if (!this.validateEmail()) {
        this.loading = false; // Stop loading if there's an error
        return;
      }

      const auth = getAuth();
      const db = getFirestore();

      try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Set display name in Firebase Auth
        await updateProfile(user, { displayName: this.username });

        // Store additional user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: this.username,
          email: this.email
        });

        // Success message
        this.successMessage = "Account created successfully! Redirecting you to login...";
        this.loading = false; // Stop loading after success

        // Sign the user out
        await signOut(auth);

        // Redirect to login page after a short delay
        setTimeout(() => {
          this.$router.push("/sign-in");
        }, 2000);
      } catch (error) {
        this.errorMessage = error.message;
        this.loading = false; // Stop loading if there's an error
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

body, html {
  height: 100%;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 15px;
}

.card {
  background-color: white;
  border-radius: 10px;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

h3 {
  font-size: 24px;
  font-weight: bold;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
}

.form-group input {
  padding: 15px;
  font-size: 16px;
}

.custom-login-btn {
  background-color: #007BFF;
  color: white;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-login-btn:hover {
  background-color: #0056b3;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

p a, .custom-link {
  color: #007BFF;
  text-decoration: none;
  font-size: 14px;
}

p a:hover, .custom-link:hover {
  text-decoration: underline;
  color: #0056b3;
}

small {
  color: #6c757d;
}

.bg-cover{
  background: url('../assets/images/register.jpg') no-repeat center center fixed;
    background-size: cover;
    margin : 0;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;  /* Hide any overflow to the right */
}
</style>
