<template>
    <div>
      <h2>Uploaded Files</h2>
      <div class="file-list">
        <div class="file-row" v-for="file in files" :key="file._id">
          <span class="file-name">{{ file.filename }}</span>
          <a
            class="download-button"
            :href="file.url"
            target="_blank"
          >Download</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  // import { io } from 'socket.io-client'
  
  export default {
    data() {
      return {
        files: [],
      };
    },
    mounted() {
      this.fetchFiles();
    },
    methods: {
      async fetchFiles() {
        try {
          const response = await axios.get('http://localhost:5000/files');
          this.files = response.data; // Store the retrieved files in the data property
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .file-list {
    display: flex;
    flex-direction: column; /* Stack rows vertically */
    margin: 20px 0; /* Add some margin for spacing */
  }
  
  .file-row {
    display: flex;
    justify-content: space-between; /* Align items on both ends */
    align-items: center; /* Center items vertically */
    padding: 10px; /* Add some padding for each row */
    border: 1px solid #ccc; /* Add a border to each row */
    border-radius: 4px; /* Rounded corners */
    margin: 5px 0; /* Margin between rows */
  }
  
  .file-name {
    flex-grow: 1; /* Allow the file name to take available space */
    padding: 0 10px; /* Add some horizontal padding */
  }
  
  .download-button {
    background-color: #007bff; /* Bootstrap primary color */
    color: white; /* White text color */
    padding: 6px 12px; /* Button padding */
    border: none; /* Remove default border */
    border-radius: 4px; /* Rounded corners for the button */
    text-decoration: none; /* Remove underline from link */
    cursor: pointer; /* Pointer cursor on hover */
  }
  
  .download-button:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
  </style>
  