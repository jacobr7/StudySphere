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
        <p>Sign up and register for events and workshops by SMU and businesses such as Goldman Sachs, Google and Meta.</p>
      </section>

  
      <!-- Note Sharing Part -->
      <section class="note-sharing-section">
        <h2>Note Sharing</h2>
        <p>Collaborate and share your notes with fellow students to enhance learning and revision.</p>
      </section>
  
      <!-- Student Forum -->
      <section class="forum-section">
        <h2>Student Forum</h2>
        <p>Join discussions, ask questions, and share your knowledge with other students.</p>
      </section>
  
      <!-- Flash Cards -->
      <section class="flashcards-section">
        <h2>Flash Cards</h2>
        <p>Create and use flashcards to help you memorize key concepts quickly and effectively.</p>
      </section>
  
      <!-- Study Rooms -->
      <section class="study-rooms-section">
        <h2>Study Rooms</h2>
        <p>Join a virtual study room to collaborate with friends and other students in real-time.</p>
      </section>
    </div>
  </template>
  
  <script>
  
  </script>
  
  <style scoped>
  .study-app-page {
    font-family: 'Poppins', sans-serif;
    background-color: #E5E4E2;
  }
  
  .intro-section,
  .events-section,
  .note-sharing-section,
  .forum-section,
  .flashcards-section,
  .study-rooms-section {
    background-color: #E5E4E2;
    width: 100%;
    padding: 0 10px;
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

.events-section, .forum-section, .study-rooms-section {
  display: block;
  justify-content: center;
  align-items: center;
  text-align: center;

}

.note-sharing-section {
  display: block;
  justify-content: right;
  align-items: right;
  padding-right: 20px;

}

.flashcards-section {
  display: block;
  margin-left: auto;
  text-align: end;
  

}


  h2 {
    color: #4682B4;
    margin-top: 10px;
  }

  p {
    color: ;
  }

</style>
  