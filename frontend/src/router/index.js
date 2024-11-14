// src/router/index.js
//1)Import necessary functions and components
import { createRouter, createWebHistory } from 'vue-router';
import Intro from '../pages/Intro.vue';
import Home from '../pages/Home.vue';
import FlashcardDecks from '../pages/FlashcardDecks.vue';
import Notesharing from '../pages/Notesharing.vue';
import SignIn from '../pages/SignIn.vue';
import Register from '../pages/Register.vue';
import StudyPage from '../pages/StudyPage.vue';
import Forum from '../pages/Forum.vue';
import Room from '../pages/Room.vue';
import Lobby from '../pages/Lobby.vue';

import { getAuth, onAuthStateChanged } from 'firebase/auth';


// 2. Define the routes
const routes = [
  {path: '/intro',name: 'Intro',component: Intro,},
    { 
    path: '/',  // The URL path (default or home route)
    name: 'Home',   // Optional: Used to refer to the route programmatically
    component: Home      // The component to render when this path is visited
    },
  { path: '/notesharing', name: 'Notesharing', component: Notesharing,
    meta: {
      requireAuth: true,
    } },
  { path: '/register', name: 'Register', component: Register},
  { path: '/sign-in', name: 'Sign-in', component: SignIn},
  { path: '/flashcarddecks', name: 'FlashcardDecks', component: FlashcardDecks,
     meta: {
    requireAuth: true,
  } },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: () => import('../pages/Flashcards.vue')
  },
  {path: '/study', name: 'StudyPage', component: StudyPage},
  {path: '/forum',name: 'Forum',component: Forum,},
  {path: '/room',name: 'Room',component: Room,},
  {path: '/lobby',name: 'Lobby',component: Lobby,},

  
];

// 3. Create the router instance
const router = createRouter({
  history: createWebHistory(),  // Use history mode(how router track url changes) for cleaner URLs (without #)
  routes,   // Provide the routes array here defined above
});


const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
          removeListener();
          resolve(user);
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if(to.matched.some((record) => record.meta.requireAuth)) {
    if (await getCurrentUser()){
      next();
    } else{
      alert("you dont have access!");
      next("/sign-up")
    }
  } else{
    next();
  }
})

// 4. Export the router so it can be used in main.js
export default router;
