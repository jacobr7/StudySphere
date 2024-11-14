<template>
    <div class="study-app-page">
      <!-- Intro Section -->
      <section class="intro-section">
        <router-link class="nav-link" to="/"><img
        class="logo"
        src="../assets/images/StudySphere.svg"
        alt="Site Logo"
        style="filter: invert(100%) brightness(200%);"
        /></router-link>
        <h2>Your all-in-one platform to boost your study sessions with collaborative tools, events, and resources.</h2>
      </section>
  
        <!-- Events Part -->
      <section class="events-section">
      <h2>Events Hub</h2>
      <p>Sign up for events in our Events Hub.</p>
      <div class="carousel-intro-container" ref="carousell">
        <div class="carousel-intro-item">
          <img src="../assets/images/event1.png" alt="SMU Animal Day" />
        </div>

        <div class="carousel-intro-item">
          <img src="../assets/images/event2.png" alt="SCIS Welfare" />
        </div>

        <div class="carousel-intro-item">
          <img src="../assets/images/event3.png" alt="Ellipsis Hackathon" />
        </div>
      </div>
    </section>

  
      <!-- Note Sharing Part -->
      <section class="note-sharing-section">
        <h2>Note Sharing</h2>
        <p>Collaborate and share your notes with fellow students to enhance learning and revision.</p>
        <img class="note-img" src="../assets/images/se101.png" alt="SE101 Notes"/>
        <img class="note-img" src="../assets/images/cs102.png" alt="CS102 Notes"/>
      </section>
  
      <!-- Student Forum -->
      <section class="forum-section">
        <h2>Student Forum</h2>
        <p>Join discussions, ask questions, and share your knowledge with other students.</p>
        <img class="forum-img" src="../assets/images/forum1.jpg" alt="SE101 Notes"/>
        <img class="forum-img" src="../assets/images/forum2.jpg" alt="SE101 Notes"/>
      </section>
  
      <!-- Flash Cards -->
      <section class="flashcards-section">
        <h2>Flash Cards</h2>
        <p>Create and use flashcards to help you memorize key concepts quickly and effectively.</p>
        <img class="flashcards-img" src="../assets/images/flashcard.jpg" alt="SE101 Notes"/>
        <img class="flashcards-img" src="../assets/images/flashcard2.jpg" alt="SE101 Notes"/>
      </section>
  
      <!-- Study Rooms -->
      <section class="study-rooms-section">
        <h2>Study Rooms</h2>
        <p>Join a virtual study room to collaborate with friends and other students in real-time.</p>
        <img class="study-img" src="../assets/images/studyroom.jpg" alt="SE101 Notes"/>
      </section>
    </div>
  </template>
  
  <script>
export default {
  data() {
    return {
    };
  },
  mounted() {
  this.startAutoScroll();
},

methods: {
  startAutoScroll() {
    setInterval(() => {
      const carousel = this.$refs.carousell;
      if (carousel) {
        // Ensure the carousel exists before calling appendChild
        carousel.appendChild(carousel.firstElementChild);
      }
    }, 3000); // Adjust interval as needed
  },
},

};
</script>
  
  <style scoped>
  .study-app-page {
    font-family: 'Poppins', sans-serif;
    background-color: #E5E4E2;
    padding-bottom: 40px;
  }
  
  .intro-section,
  .note-sharing-section,
  .forum-section,
  .flashcards-section,
  .study-rooms-section {
    background-color: #E5E4E2;
    width: 100%;
    padding: 0 10px;
    display: block;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .intro-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0; /* Reduce padding to decrease space at the top */
  text-align: center;
  background-color: #85D7FF;
}

.logo {
  display: block;
  width: 300px; /* Adjust the size if necessary */
  margin: 20px auto 10px auto; /* Reduce top margin to bring it closer to the top */
}

.events-section {
  text-align: center;
  margin: 40px auto;
  position: relative;
  width: 80%; /* Adjust as needed */
  overflow: hidden; /* Hide overflow for the carousel effect */
}

.note-img {
  width: 200px;
  height: 300px;
  border-radius: 15px;
  padding: 5px;  
}

.flashcards-img, .forum-img {
  width: 400px;
  border-radius: 15px;
  padding: 5px;  

}

.study-img {
  width: 400px;
  border: 2px #85D7FF solid;
  border-radius: 15px;
}

.carousel-intro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;
  gap: 20px; /* Adjust for spacing between images */
}

.carousel-intro-item {
  position: relative;
  flex: 0 0 auto;
  width: 250px; /* Adjust width as needed */
  transform: scale(0.9); /* Slightly scale down for effect */
  transition: transform 0.3s ease-in-out, z-index 0.3s ease;
}

.carousel-intro-item:hover {
  transform: scale(1); /* Scale up when hovered */
  z-index: 10; /* Bring to front */
}

.carousel-intro-item img {
  width: 100%;
  height: auto;
  border-radius: 10px; /* Rounded corners */
}

.carousel-intro-item h3 {
  margin-top: 10px;
  color: #333; /* Adjust text color as needed */
}


h2 {
  color: #4682B4;
  margin-top: 10px;
}

p {
  color: black;
}

</style>
  