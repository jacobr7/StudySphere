<template>
  <div>
    <h1>Notes</h1>
    <ul>
      <li v-for="note in notes" :key="note.id">{{ note.title }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      notes: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:5000/notes'); // Your backend endpoint
      this.notes = response.data; // Set the fetched notes to the component data
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
