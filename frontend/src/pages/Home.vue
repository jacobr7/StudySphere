<template>
  <div class="event-page">
    <div v-if="events.length" class="event-container">
      <h1 class="text-center mb-4">Events Hub</h1>
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
    <div v-if="showSignUpModal" class="modal d-block" role="dialog" style="background: rgba(0, 0, 0, 0.5)">
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
            <label for="userContact">Contact Number</label>
            <input type="text" class="form-control" id="userContact" v-model="userContact" required />
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
      userContact: '',
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
        
        // Map the events and sort them by the event date (earliest first)
        this.events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort events by date
        this.events.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by the 'date' field
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
      this.userContact = '';
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
  // Adjust the start date to GMT+8 and get only the date part
  const startDate = new Date(new Date(event.date).getTime() + 8 * 60 * 60 * 1000);
  
  // Format date in YYYYMMDD format for an all-day event
  const startDateString = startDate.toISOString().slice(0, 10).replace(/-/g, '');
  const endDateString = startDateString; // Single-day all-day event uses the same start and end date

  // Google Calendar URL format for all-day events
  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(event.name)}&dates=${startDateString}/${endDateString}&details=${encodeURIComponent(event.name)} at ${event.venue}&location=${encodeURIComponent(event.venue)}`;

  // Outlook Calendar URL format for all-day events
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.name)}&startdt=${startDateString}&enddt=${endDateString}&location=${encodeURIComponent(event.venue)}&body=${encodeURIComponent(event.name)} at ${event.venue}`;

  // Yahoo Calendar URL format for all-day events
  const yahooCalendarUrl = `https://calendar.yahoo.com/?v=60&view=d&st=${startDateString}&et=${endDateString}&title=${encodeURIComponent(event.name)}&in_loc=${encodeURIComponent(event.venue)}&desc=${encodeURIComponent(event.name)} at ${event.venue}`;

  // Apple Calendar (ICS) format for all-day events
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//NONSGML iCalCreator 1.0//EN
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART;VALUE=DATE:${startDateString}
DTEND;VALUE=DATE:${endDateString}
LOCATION:${event.venue}
DESCRIPTION:${event.name} at ${event.venue}
END:VEVENT
END:VCALENDAR`;

  const icsBlob = new Blob([icsContent], { type: 'text/calendar' });
  const icsUrl = URL.createObjectURL(icsBlob);

  const calendarChoice = prompt("Which calendar would you like to add this event to? (Enter Google, Outlook, Yahoo, or Apple)");

  if (calendarChoice.toLowerCase() === 'google') {
    window.open(googleCalendarUrl, '_blank');  // Open Google Calendar in a new tab
  } else if (calendarChoice.toLowerCase() === 'outlook') {
    window.open(outlookCalendarUrl, '_blank'); // Open Outlook Calendar in a new tab
  } else if (calendarChoice.toLowerCase() === 'yahoo') {
    window.open(yahooCalendarUrl, '_blank');   // Open Yahoo Calendar in a new tab
  } else if (calendarChoice.toLowerCase() === 'apple') {
    const link = document.createElement('a');
    link.href = icsUrl;
    link.download = `${event.name}.ics`;
    link.click();
    URL.revokeObjectURL(icsUrl);              // Release the blob URL
  }
},
    previousPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.maxPage) this.currentPage++;
    },
  },
};
</script>

<style scoped>
.event-page {
  background-color: #141B4D;
  color: #8A704C;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

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
  margin-bottom: 1rem;
}

.card-text {
  margin-bottom: 0.5rem;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}

.mt-4 {
  margin-top: 1.5rem;
}

button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.modal-content {
  background-color: #2c3e50;
  color: #fff;
}

.close {
  color: #fff;
}

button.btn-warning {
  background-color: #f1c40f;
  border: none;
}
</style>
