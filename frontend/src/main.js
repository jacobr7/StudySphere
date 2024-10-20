//main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // Import the router

// Create the app instance
const app = createApp(App); // Create the app instance

// Use the router instance with the app
app.use(router); // Correct usage: use the router with the app instance

// Mount the app
app.mount('#app');