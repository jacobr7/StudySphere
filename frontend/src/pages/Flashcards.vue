<template>
  <div class="flashcards-page">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">StudySphere</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/forum">Forum</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/notes">Notes</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/flashcarddecks">Flashcard Decks</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Flashcards Container -->
    <div class="container mt-4">
      <h2 class="deck-title">Deck: {{ deckTitle }}</h2>
      <div id="flashcards-container">
        <div v-if="flashcards.length">
          <div v-for="card in flashcards" :key="card.id" class="flashcard">
            <button class="delete-btn" @click="confirmDeleteFlashcard(card.id)">&times;</button>
            <div class="flashcard-content">
              <div class="flashcard-front">
                <span class="label">Q:</span>
                <p class="content">{{ card.f1 }}</p>
              </div>
              <div class="flashcard-back">
                <span class="label">Ans:</span>
                <p class="content">{{ card.f2 }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No flashcards available.</p>
      </div>
    </div>

    <!-- Floating Buttons -->
    <button class="floating-btn2" @click="goBack">Back</button>
    <button class="study-btn" @click="goToStudyPage">Study</button>
    <button class="floating-btn" @click="openAddFlashcardModal">+</button>

    <!-- Modal for Adding Flashcards -->
    <div class="modal fade" id="addFlashcardModal" tabindex="-1" aria-labelledby="addFlashcardModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addFlashcardModalLabel">Add New Flashcard</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addFlashcard">
              <div class="mb-3">
                <label for="front" class="form-label">Front</label>
                <input type="text" v-model="newFlashcard.front" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="back" class="form-label">Back</label>
                <input type="text" v-model="newFlashcard.back" class="form-control" required>
              </div>
              <button type="submit" class="btn btn-primary">Add Card</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { Modal } from 'bootstrap';

const auth = getAuth();
const db = getFirestore();

export default {
  name: 'Flashcards',
  data() {
    return {
      deckTitle: '',
      flashcards: [],
      newFlashcard: { front: '', back: '' },
      deckId: this.$route.query.deckId || null,
    };
  },
  methods: {
    async loadDeckTitle() {
      const user = auth.currentUser;
      if (user && this.deckId) {
        try {
          const deckDoc = await getDoc(doc(db, "users", user.uid, "decks", this.deckId));
          if (deckDoc.exists()) {
            this.deckTitle = deckDoc.data().title;
          }
        } catch (error) {
          console.error("Error loading deck title:", error);
        }
      }
    },
    async loadFlashcards() {
      const user = auth.currentUser;
      if (user && this.deckId) {
        try {
          const flashcardsQuery = query(
            collection(db, "users", user.uid, "decks", this.deckId, "cards"),
            orderBy("timestamp", "desc")
          );
          const flashcardsSnapshot = await getDocs(flashcardsQuery);
          this.flashcards = flashcardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error("Error loading flashcards:", error);
        }
      }
    },
    async addFlashcard() {
      const user = auth.currentUser;
      if (user && this.deckId && this.newFlashcard.front && this.newFlashcard.back) {
        try {
          const cardData = {
            f1: this.newFlashcard.front,
            f2: this.newFlashcard.back,
            timestamp: new Date()
          };
          await addDoc(collection(db, "users", user.uid, "decks", this.deckId, "cards"), cardData);
          this.loadFlashcards();
          this.newFlashcard = { front: '', back: '' };
          Modal.getInstance(document.getElementById('addFlashcardModal')).hide();
        } catch (error) {
          console.error("Error adding flashcard:", error);
        }
      }
    },
    async deleteFlashcard(cardId) {
      const user = auth.currentUser;
      if (user && this.deckId) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "decks", this.deckId, "cards", cardId));
          this.loadFlashcards();
          console.log("Flashcard deleted successfully");
        } catch (error) {
          console.error("Error deleting flashcard:", error);
          alert("Failed to delete flashcard. Please try again.");
        }
      }
    },
    confirmDeleteFlashcard(cardId) {
      if (confirm("Are you sure you want to delete this flashcard?")) {
        this.deleteFlashcard(cardId);
      }
    },
    goBack() {
      this.$router.push('/flashcarddecks');
    },
    goToStudyPage() {
      const deckId = this.deckId; 
      this.$router.push({ name: 'StudyPage', query: { deckId } });
    },
    openAddFlashcardModal() {
      new Modal(document.getElementById('addFlashcardModal')).show();
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadDeckTitle();
        this.loadFlashcards();
      } else {
        this.$router.push('/sign-in');
      }
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

body {
  background-color: #f4f4f9;
  font-family: 'Poppins', sans-serif;
}

.navbar {
  background-color: #141B4D !important;
}
.navbar-brand {
  color: #ff9800 !important;
  font-weight: bold;
}
.navbar .form-control {
  background-color: #ffffff20;
  border: 1px solid #fff;
  color: white;
}
.navbar .form-control, .navbar .btn, .navbar .nav-link {
  color: white !important;
}

/* Deck title */
.deck-title {
  text-align: center;
  color: #141B4D;
  font-weight: bold;
  margin-top: 20px;
  font-size: 1.5rem;
}

/* Flashcard */
.flashcard {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.flashcard-content {
  display: flex;
  width: 100%;
  gap: 20px;
}
.flashcard-front {
  border-right: 1px solid #ccc;
  width: 50%;
}
.flashcard-back {
  width: 50%;
}
.label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #555;
}
.content {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
}

/* Delete Button */
.delete-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 18px;
  cursor: pointer;
  position: absolute; 
  top: 5px;
  right: 5px; 
}
.delete-btn:hover {
  color: #ff0000;
}

/* Floating Buttons */
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.floating-btn2 {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: #3b82f6;
  color: white;
  font-size: 25px;
  border-radius: 5%;
}
.study-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
}
.study-btn:hover {
  background-color: #45a049;
}

/* Modal styling */
.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.modal-header {
  background-color: #007bff;
  color: white;
}
.modal-title {
  font-weight: bold;
}
</style>
