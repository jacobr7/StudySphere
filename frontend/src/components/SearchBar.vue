<template>
  <div class="search-container">
    <input type="text" v-model="query" @input="onInputChange" @focus="showDropdown = true" @blur="hideDropdown"
      placeholder="Search..." class="search-input" />

    <ul v-if="showDropdown && filteredSuggestions.length" class="dropdown-list">
      <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @mousedown="selectSuggestion(suggestion)"
        class="dropdown-item">
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['refreshSuggestions'],
  watch: {
    refreshSuggestions: 'getSuggestions'
  },
  data() {
    return {
      query: '', // User's search input
      suggestions: [], // Available options
      filteredSuggestions: [], // Filtered suggestions based on input
      showDropdown: false, // Controls dropdown visibility
    };
  },
  methods: {
    // Filters suggestions based on the query
    filterSuggestions() {
      const q = this.query.toLowerCase();
      this.filteredSuggestions = this.suggestions.filter((item) =>
        item.toLowerCase().includes(q)
      );
    },
    // Selects a suggestion and fills the search bar
    selectSuggestion(suggestion) {
      this.query = suggestion;
      this.showDropdown = false;
      this.onInputChange();
    },
    // Delays hiding to allow clicking on suggestions
    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    },
    async getSuggestions() {
      try {
        const response = await axios.get('https://study-sphere-z8xi.vercel.app/api/uniqueCourseCodes');//http://localhost:5000/api/unique-course-codes
        this.suggestions = response.data;
      } catch (error) {
        console.log("Error fetching course codes", error)
      }
    },
    onInputChange() {
      this.$emit('searchQuery', this.query);
      this.filterSuggestions();
    }
  },
  mounted() {
    this.getSuggestions();//Fetch suggestion when mounted
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 200px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  list-style: none;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  color: black;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
  color: #002638
}


</style>