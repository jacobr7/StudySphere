<template>
  <div class="event-page">
    <div v-if="events.length" class="event-container">
      <div class="row">
        <!-- Display 3 cards at a time -->
        <div 
          v-for="(event, index) in visibleEvents" 
          :key="event.id" 
          class="col-12 col-md-4 mb-4"
        >
          <!-- Event Card -->
          <div class="card">
            <img :src="event.image" class="card-img-top" alt="Event Image" />
            <div class="card-body">
              <h5 class="card-title">{{ event.name }}</h5>
              <p class="card-text"><strong>Date:</strong> {{ event.date }}</p>
              <p class="card-text"><strong>Time:</strong> {{ event.time }}</p>
              <p class="card-text"><strong>Venue:</strong> {{ event.venue }}</p>
              <p class="card-text"><strong>Available Slots:</strong> {{ event.availableSlots }}</p>
              <div class="d-flex justify-content-between">
                <button 
                  v-if="event.availableSlots > 0" 
                  @click="openSignUpForm(event)" 
                  class="btn btn-primary"
                >
                  Sign Up
                </button>
                <button 
                  @click="addToCalendar(event)" 
                  class="btn btn-warning"
                >
                  Add to Calendar
                </button>
              </div>
              <span v-if="event.isFull" class="badge bg-danger mt-2">Fully Booked</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Navigation Arrows -->
      <div class="d-flex justify-content-between mt-4">
        <button 
          class="btn btn-outline-light" 
          :disabled="currentPage === 0" 
          @click="previousPage"
        >
          &lt; Prev
        </button>
        <button 
          class="btn btn-outline-light" 
          :disabled="currentPage >= maxPage" 
          @click="nextPage"
        >
          Next &gt;
        </button>
      </div>
    </div>
    <div v-else>
      <p>Loading events...</p>
    </div>

    <!-- Sign Up Form Modal -->
    <div v-if="showSignUpModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sign Up for {{ selectedEvent?.name }}</h5>
            <button type="button" class="close" @click="closeSignUpForm">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitSignUp">
              <div class="form-group">
                <label for="userName">Name</label>
                <input type="text" class="form-control" id="userName" v-model="userName" required />
              </div>
              <div class="form-group">
                <label for="userEmail">Email</label>
                <input type="email" class="form-control" id="userEmail" v-model="userEmail" required />
              </div>
              <button type="submit" class="btn btn-primary mt-3">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default {
  name: 'Home',
  data() {
    return {
      events: [],
      currentPage: 0,
      eventsPerPage: 3, // Show 3 cards per page
      userName: '',
      userEmail: '',
      showSignUpModal: false,
      selectedEvent: null,
    };
  },
  computed: {
    visibleEvents() {
      // Calculate which events to show based on currentPage
      const startIndex = this.currentPage * this.eventsPerPage;
      return this.events.slice(startIndex, startIndex + this.eventsPerPage);
    },
    maxPage() {
      // Calculate the maximum page number based on the number of events
      return Math.ceil(this.events.length / this.eventsPerPage) - 1;
    },
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const db = getFirestore(); // Initialize Firestore
        const querySnapshot = await getDocs(collection(db, "events"));
        this.events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    openSignUpForm(event) {
      // Open the sign-up form and set the selected event
      this.selectedEvent = event;
      this.showSignUpModal = true;
    },
    closeSignUpForm() {
      // Close the sign-up form modal
      this.showSignUpModal = false;
      this.selectedEvent = null;
      this.userName = '';
      this.userEmail = '';
    },
    async submitSignUp() {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, this.userEmail, 'temporarypassword');
        const user = userCredential.user;

        // After successful sign-up, update available slots in Firestore
        if (this.selectedEvent && this.selectedEvent.availableSlots > 0) {
          const eventRef = doc(getFirestore(), 'events', this.selectedEvent.id);
          await updateDoc(eventRef, {
            availableSlots: this.selectedEvent.availableSlots - 1,
          });
        }

        alert(`Welcome, ${this.userName}! You have successfully signed up for ${this.selectedEvent.name}.`);
        this.closeSignUpForm();
      } catch (error) {
        console.error('Error signing up:', error);
        alert('There was an error signing up. Please try again.');
      }
    },
    addToCalendar(event) {
      alert(`Event '${event.name}' added to your calendar!`);
    },
    nextPage() {
      if (this.currentPage < this.maxPage) {
        this.currentPage += 1;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
      }
    },
  },
};
</script>

<style scoped>
.event-page {
  background-color: #141B4D;
  color: #8A704C;
  padding: 20px;
}

.card {
  background-color: #2c3e50;
  color: white;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
}

.card-text {
  font-size: 1rem;
}

.btn {
  width: 48%;
}

.badge {
  margin-top: 10px;
}

.event-container {
  margin-top: 20px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Modal Styling */
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 500px;
  margin: 5% auto;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
}

.close {
  font-size: 1.5rem;
}

.form-control {
  margin-bottom: 10px;
}
</style>
