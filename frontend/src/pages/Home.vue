<template>
  <div class="event-page">
    <div v-if="events.length" id="eventsCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(event, index) in events" :key="event.id" class="carousel-item" :class="{ active: index === 0 }">
          <div class="carousel-item-content">
            <h3>{{ event.name }}</h3>
            <p><strong>Date:</strong> {{ event.date }}</p>
            <p><strong>Time:</strong> {{ event.time }}</p>
            <p><strong>Venue:</strong> {{ event.venue }}</p>
            <p><strong>Available Slots:</strong> {{ event.availableSlots }}</p>
            <div class="d-flex justify-content-center">
              <a :href="event.link" target="_blank" class="btn btn-primary mx-2">Sign Up</a>
              <button @click="addToCalendar(event)" class="btn btn-warning mx-2">Add to Calendar</button>
              <span v-if="event.isFull" class="badge bg-danger mx-2">Fully Booked</span>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#eventsCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#eventsCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div v-else>
      <p>Loading events...</p>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

export default {
  name: 'Home',
  data() {
    return {
      events: [],
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        this.events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    addToCalendar(event) {
      alert(`Event '${event.name}' added to your calendar!`);
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

.carousel-item-content {
  text-align: center;
}

/* Additional styles */
</style>
