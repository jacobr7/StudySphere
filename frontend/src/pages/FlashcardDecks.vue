<template>
  <div class="bg">
      <!-- Typing Loading Indicator -->
      <div v-if="loading" class="loading-typing">
        <span class="loading-text">Loading...</span>
      </div>

      <!-- Flashcard Decks Section -->
      <div v-else class="flashcard-container" id="flashcard-container">
          <div v-if="decks.length === 0">No decks available.</div>
          <div
            v-for="deck in decks"
            :key="deck.id"
            :class="['flashcard-deck', `deck-${deck.color}`]"
          >

          <div class="card-count-badge">{{ deck.cardCount || 0 }} cards</div>
          <button class="delete-btn" @click="confirmDeleteDeck(deck.id)">&times;</button>
            <div class="flashcard-deck-title">{{ deck.title }}</div>
            <div class="flashcard-actions">
              <button @click="openStudy(deck.id)">Study</button>
              <button @click="addFlashcards(deck.id)">Add Flashcards</button>
            </div>
          </div>
      </div>

      <!-- Floating Button to Open Add Deck Modal -->
      <button class="floating-btn" @click="openAddDeckModal">
          <svg class="pluslogo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18M12 6V18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </button>

      <!-- Modal for Creating New Deck -->
      <div class="modal fade" id="addDeckModal" tabindex="-1" aria-labelledby="addDeckModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="addDeckModalLabel">Create New Deck</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form @submit.prevent="createDeck">
                          <div class="mb-3">
                              <label for="deckName" class="form-label">Deck Name</label>
                              <input type="text" v-model="deckName" class="form-control" id="deckName" required />
                          </div>
                          <div class="mb-3">
                              <label for="deckColor" class="form-label">Deck Color</label>
                              <select v-model="deckColor" class="form-select" id="deckColor" required>
                                  <option value="blue">Blue</option>
                                  <option value="green">Green</option>
                                  <option value="yellow">Yellow</option>
                                  <option value="red">Red</option>
                                  <option value="lilac">Lilac</option>
                                  <option value="pink">Pink</option>
                              </select>
                          </div>
                          <button type="submit" class="btn btn-primary" style="background-color: #00A3E0; border: 0cm;">Create Deck</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { db } from '../firebase.js';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, doc, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  data() {
    return {
      decks: [],
      deckName: "",
      deckColor: "blue",
      modalInstance: null, // Add a reference to the modal instance
      loading: true, // Loading indicator
    };
  },
  methods: {
    openAddDeckModal() {
      this.modalInstance = new window.bootstrap.Modal(document.getElementById("addDeckModal"));
      this.modalInstance.show();
    },
    async createDeck() {
      const user = auth.currentUser;
      if (user) {
        const deckData = {
          title: this.deckName,
          color: this.deckColor,
          timestamp: new Date(),
        };
        
        await addDoc(collection(db, "users", user.uid, "decks"), deckData);
        this.loadDecks(user.uid);

        // Reset form fields
        this.deckName = "";
        this.deckColor = "blue";
        
        // Hide the modal
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
      }
    },
    async confirmDeleteDeck(deckId) {
    const user = auth.currentUser;
    if (user) {
      // Show a confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to delete this deck?");
      if (isConfirmed) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "decks", deckId));
          this.loadDecks(user.uid); // Reload decks after deletion
        } catch (error) {
          console.error("Error deleting deck:", error);
        }
      }
    }
  },
    async loadDecks(userId) {
      this.loading = true; // Start loading indicator
      const decks = [];
      const q = query(collection(db, "users", userId, "decks"), orderBy("timestamp"));
      const snapshot = await getDocs(q);

      for (const deckDoc of snapshot.docs) {
        const deckData = deckDoc.data();
        
        // Fetch cards in the deck to count them
        const cardsSnapshot = await getDocs(collection(db, "users", userId, "decks", deckDoc.id, "cards"));
        const cardCount = cardsSnapshot.size;

        decks.push({ id: deckDoc.id, ...deckData, cardCount }); 
      }

      this.decks = decks;
      this.loading = false; // End loading indicator
    },
    openStudy(deckId) {
      this.$router.push({ name: 'StudyPage', query: { deckId } });
    },
    addFlashcards(deckId) {
      this.$router.push({ name: 'Flashcards', query: { deckId } });
    },
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadDecks(user.uid);
      } else {
        this.$router.push("/login");
      }
    });

    // Initialize the modal instance on mount
    this.modalInstance = new window.bootstrap.Modal(document.getElementById("addDeckModal"), {
      backdrop: 'static', // Prevent closing by clicking outside the modal
      keyboard: false, // Prevent closing with the Esc key
    });
  },
};
</script>

<style scoped>  
.bg{
  font-family: 'Poppins', sans-serif;
}

/* Loading Typing Container */
.loading-typing {
  font-family: 'Roboto Mono', monospace;
  font-size: 2rem;
  color:  #555ea1; 
  padding: 20px;
  text-align: left;
}

/* Typing effect for Loading Text */
.loading-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: .15em solid #555ea1; 
  animation: typing 4s steps(15, end) infinite, blink-caret 0.5s step-end infinite;
}

/* Keyframes for typing */
@keyframes typing {
  0% { width: 0; }
  100% { width: 8.5em; }
}

/* Keyframes for blinking caret */
@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color:  #555ea1; }
}

.flashcard-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 20px;
}

@media (min-width: 1200px) { 
.flashcard-container {
  grid-template-columns: repeat(5, 1fr); /* 5 columns on large screens */
}
}

.flashcard-deck {
    background-color: #007bff;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.flashcard-deck:hover {
    transform: translateY(-5px);
}

.flashcard-deck-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.flashcard-actions {
    display: flex;
    justify-content: space-around;
}

.flashcard-actions button {
    background: none;
    border: none;
    color: inherit; 
    font: inherit;    
    cursor: pointer;
    text-decoration: none;
}

.flashcard-actions button:hover {
  font-weight: bold;
}

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

.floating-btn:hover {
  background-color:#0b8ebe;
}

.pluslogo{
  width: 30px;
  height: 30px;
}

.modal-content {
    border-radius: 8px;
}

.modal-header {
    background-color: #85D7FF;
    color: white;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  outline: none;
}

.delete-btn:hover {
  color: #ff0000;
}

.card-count-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  color: white;
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}

/* Deck Colors */
.deck-red { background-color: #f8776b; }
.deck-green { background-color: #6ABF69; }
.deck-lilac { background-color: #bfa6ef; }
.deck-yellow { background-color: #f7cd6c; }
.deck-pink { background-color: #FFC1E3; }
.deck-blue { background-color: #7192cf; }

</style>
