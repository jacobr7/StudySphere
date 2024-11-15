<template>
  <div class="flashcards-page">
    <!-- Flashcards Container -->
    <div class="container mt-4">
      <h2 class="deck-title">Deck: {{ deckTitle }}</h2>
      
      <!-- Flashcards Grid -->
      <div class="row mb-5" v-if="flashcards.length">
        <div
          v-for="card in flashcards"
          :key="card.id"
          class="col-12 col-lg-6 mb-4"
        >
          <div class="flashcard card p-3 shadow-sm position-relative">
            <button class="delete-btn btn-close" @click="confirmDeleteFlashcard(card.id)">&times;</button>
            <div class="flashcard-content d-flex justify-content-between">
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
      </div>
      
      <p v-else>No flashcards available.</p>
    </div>

    <!-- Floating Buttons -->
    <button class="floating-btn2 btn btn-primary" @click="goBack">< Back To Decks</button>
    <button class="study-btn btn btn-success" @click="goToStudyPage">Study</button>
    <button class="floating-btn btn btn-info" @click="openAddFlashcardModal">
      <svg class="pluslogo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12H18M12 6V18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

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
              <button type="submit" class="btn btn-primary" style="background-color: #00A3E0; border: 0cm;">Add Card</button>
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
  position: relative;
}

.flashcard-content {
  display: flex;
  gap: 20px;
}

.flashcard-front, .flashcard-back {
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
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #fe3d3d;
  cursor: pointer;padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

}

.delete-btn:focus ,.delete-btn:active{
  outline: none; 
  box-shadow: none; 
}

.delete-btn:hover {
  color: #ff0000;
}

/* Floating Buttons */
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #00A3E0;;
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  line-height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.pluslogo{
    width: 30px;
    height: 30px;
  }


.floating-btn:hover {
  background-color:#0b8ebe;
}

.floating-btn2 {
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
  color: white;
  font-weight: bold;
  background-color: #3b82f6;
}
  
.floating-btn2:hover{
  background-color: #2563eb;
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
  font-weight: bold;
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
  background-color: #85D7FF ;
  color: white;
}
.modal-title {
  font-weight: bold;
}



</style>
