<template>
    <div>
        <!-- Flashcard Decks Section -->
      <div class="flashcard-container" id="flashcard-container">
        <div v-if="decks.length === 0">No decks available.</div>
        <div
          v-for="deck in decks"
          :key="deck.id"
          :class="['flashcard-deck', `deck-${deck.color}`]"
        >
        <button class="delete-btn" @click="confirmDeleteDeck(deck.id)">&times;</button>
          <div class="flashcard-deck-title">{{ deck.title }}</div>
          <div class="flashcard-actions">
            <button @click="openStudy(deck.id)">Study</button>
            <button @click="addFlashcards(deck.id)">Add Flashcards</button>
          </div>
        </div>
      </div>
  
      <!-- Floating Button to Open Add Deck Modal -->
      <button class="floating-btn" @click="openAddDeckModal">+</button>
  
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
                    <option value="teal">Teal</option>
                    <option value="gray">Gray</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Create Deck</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
    // Import Firebase functions
    import { db } from '../firebase.js';
    import { auth } from '../firebase.js';
    import { getAuth, onAuthStateChanged,  } from 'firebase/auth';
    import { getFirestore, collection, addDoc, doc, getDocs, orderBy, query, deleteDoc} from 'firebase/firestore';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js';
    
    // Initialize Firebase

    export default {
    data() {
        return {
        decks: [],
        deckName: "",
        deckColor: "blue",
        modalInstance: null, // Add a reference to the modal instance
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
            subtitle: "0 cards in deck",
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
            try {
              await deleteDoc(doc(db, "users", user.uid, "decks", deckId));
              this.loadDecks(user.uid); // Reload decks after deletion
            } catch (error) {
              console.error("Error deleting deck:", error);
            }
          }
        },
        async loadDecks(userId) {
        const decks = [];
        const q = query(collection(db, "users", userId, "decks"), orderBy("timestamp"));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            decks.push({ id: doc.id, ...doc.data() });
        });
        this.decks = decks;
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
  /* Include the specific styles for FlashcardDecks from style.css */
  body {
      background-color: #f4f4f9;
      font-family: 'Poppins', sans-serif;
  }
  

  
  .flashcard-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      padding: 20px;
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
      transition: background-color 0.3s;
  }
  
  .floating-btn:hover {
      background-color: #e04848;
  }
  
  /* Modal Styling */
  .modal-content {
      border-radius: 8px;
  }
  
  .modal-header {
      background-color: #141B4D;
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
}
.delete-btn:hover {
  color: #ff0000;
}

  
  /* Deck Colors */
  .deck-blue { background-color: #007bff; }
  .deck-green { background-color: #28a745; }
  .deck-yellow { background-color: #ffc107; }
  .deck-red { background-color: #dc3545; }
  .deck-teal { background-color: #20c997; }
  .deck-gray { background-color: #6c757d; }
  .deck-dark { background-color: #343a40; }
  </style>
  
