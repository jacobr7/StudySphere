<template>
    <div>
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #141B4D;">
        <div class="container-fluid">
          <a class="navbar-brand text-white" href="#">StudySphere</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
              <li class="nav-item"><a class="nav-link active" href="#">Forum</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Notes</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Flashcard</a></li>
            </ul>
          </div>
        </div>
      </nav>
  
      <!-- Flashcard Decks Section -->
      <div class="flashcard-container" id="flashcard-container">
        <div v-if="decks.length === 0">No decks available.</div>
        <div
          v-for="deck in decks"
          :key="deck.id"
          :class="['flashcard-deck', `deck-${deck.color}`]"
        >
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
    import { initializeApp } from 'firebase/app';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, collection, addDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
    import 'bootstrap/dist/js/bootstrap.bundle.min.js';

    const firebaseConfig = {
        apiKey: "AIzaSyCSTt_BtYR07qzKHm9pBgJ93RARJjt-HNA",
        authDomain: "studysphere-8f8ae.firebaseapp.com",
        projectId: "studysphere-8f8ae",
        storageBucket: "studysphere-8f8ae.appspot.com",
        messagingSenderId: "1043087075619",
        appId: "1:1043087075619:web:10ddd930f52125a0960496",
        measurementId: "G-Q4FTB6VJEC"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

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
  
  .navbar {
      background-color: #141B4D !important;
  }
  
  .navbar .navbar-brand, 
  .navbar .nav-link {
      color: white !important;
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
  
  /* Deck Colors */
  .deck-blue { background-color: #007bff; }
  .deck-green { background-color: #28a745; }
  .deck-yellow { background-color: #ffc107; }
  .deck-red { background-color: #dc3545; }
  .deck-teal { background-color: #20c997; }
  .deck-gray { background-color: #6c757d; }
  .deck-dark { background-color: #343a40; }
  </style>
  
