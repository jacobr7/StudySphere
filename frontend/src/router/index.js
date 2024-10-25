// src/router/index.js
//1)Import necessary functions and components
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Notesharing from '../pages/Notesharing.vue';

// 2. Define the routes
const routes = [
    { 
    path: '/',  // The URL path (default or home route)
    name: 'Home',   // Optional: Used to refer to the route programmatically
    component: Home      // The component to render when this path is visited
    },
  { path: '/notesharing', name: 'Notesharing', component: Notesharing },
  
];

// 3. Create the router instance
const router = createRouter({
  history: createWebHistory(),  // Use history mode(how router track url changes) for cleaner URLs (without #)
  routes,   // Provide the routes array here defined above
});

// 4. Export the router so it can be used in main.js
export default router;
