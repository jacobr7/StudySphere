<template>
  <div class="study-page">
    
    <!-- Study Mode Content -->
    <div class="container mt-4">
      <h2 class="study-title">Study Mode</h2>
      <div class="study-flashcard">
        <!-- Display the front of the card -->
        <div v-if="currentFlashcard && currentFlashcard.f1" class="flashcard-content question-area">
          {{ currentFlashcard.f1 }}
        </div>
        <!-- Display the answer only if it exists and showAnswer is true -->
        <div v-if="currentFlashcard && currentFlashcard.f2 && showAnswer" class="flashcard-content answer-area">
          {{ currentFlashcard.f2 }}
        </div>
        <!-- Show Reveal Answer button if the answer is not yet revealed -->
        <button v-if="!showAnswer && currentFlashcard && currentFlashcard.f2" @click="revealAnswer" class="study-reveal-btn" style="background-color: #00A3E0; border: 0cm;">
          Reveal Answer
        </button>
      </div>
    </div>

    <!-- Controls -->
    <div class="study-controls">
      <button class="study-back-btn" @click="goBack"> < Back To Decks</button>
      <button class="study-next-btn" @click="loadNextCard">Next Card</button>
    </div>
  </div>
</template>


<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();
const auth = getAuth();

export default {
  name: 'StudyPage',
  data() {
  return {
      flashcards: [],
      currentFlashcard: null,
      shownCards: new Set(),
      showAnswer: false,
      deckId: this.$route.query.deckId || null,
    };
  },
  methods: {
  async loadFlashcards() {
      const user = auth.currentUser;
      if (user && this.deckId) {
      try {
          const snapshot = await getDocs(collection(db, "users", user.uid, "decks", this.deckId, "cards"));
          this.flashcards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.loadNextCard();
      } catch (error) {
          console.error("Error loading flashcards:", error);
      }
      }
  },
  loadNextCard() {
      if (this.flashcards.length === 0) return;

      // Clear shown cards if all have been shown
      if (this.shownCards.size === this.flashcards.length) this.shownCards.clear();

      let randomIndex;
      do {
          randomIndex = Math.floor(Math.random() * this.flashcards.length);
      } while (this.shownCards.has(randomIndex) || (this.currentFlashcard && this.flashcards[randomIndex].id === this.currentFlashcard.id));

      // Add the new index to the shownCards set
      this.shownCards.add(randomIndex);

      // Update the current flashcard and reset the showAnswer flag
      this.currentFlashcard = this.flashcards[randomIndex];
      this.showAnswer = false;
  },

  revealAnswer() {
      this.showAnswer = true;
      console.log("showAnswer is now:", this.showAnswer);
      console.log("currentFlashcard:", this.currentFlashcard);
  },
  goBack() {
      this.$router.push('/flashcarddecks');
  }},
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) this.loadFlashcards();
      else this.$router.push('/sign-in');
    });
  }
};
</script>

<style scoped>
/* Navbar styling */
.navbar {
  background-color: #141B4D !important;
}
.navbar-brand {
  color: #ff9800 !important;
}
.navbar .form-control {
  background-color: #ffffff20;
  color: white;
  border: 1px solid #fff;
}
.navbar .form-control, .navbar .btn, .navbar .nav-link {
  color: white !important;
}

/* Page styling */
body {
  background-color: #f4f4f9;
  font-family: 'Poppins', sans-serif;
}

.study-title {
  text-align: center;
  color: #141B4D;
  font-weight: bold;
  margin-top: 20px;
  font-size: 1.5rem;
}

.study-flashcard {
  max-width: 500px;
  margin: 30px auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.flashcard-content {
  font-size: 1.2rem;
  color: #333;
  padding: 10px;
  text-align: center;
  min-height: 100px;
}

.question-area {
  font-weight: bold;
  font-size: 1.4rem;
  color: #141B4D;
}

.answer-area {
  font-size: 1.2rem;
  color: #4CAF50;
  
}

.study-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.study-reveal-btn, .study-next-btn{
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 10px;
}



.study-back-btn{
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 10px;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
}

.study-back-btn:hover{
  background-color: #0056b3;
}

.study-reveal-btn {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.study-reveal-btn:hover {
  background-color: #0056b3;
}

.study-next-btn {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.study-next-btn:hover {
  background-color: #45a049;
}

.study-back-btn:hover {
  background-color: #2563eb;
}
</style>

