<template>
  <div>
    <h2>{{ showAllNotes ? "All Notes" : "Your Notes" }}</h2>
    <div class="file-card-list container-fluid">
      <div class="card" style="width: 18rem;" v-for="file in filteredFiles" :key="file._id">
        <div class="row">
          <img src="../assets/SSLogo.jpeg" class="card-img-top" alt="...">
        </div>

        <div class="card-body">
          <div class="row">
            <h5 class="card-title">{{ file.courseCode }}</h5>
          </div>
          <div class="row">
            <p class="card-text">{{ file.filename }}</p>
          </div>

          <div class="button-container row mt-auto"><!-- http://localhost:5000/download/ -->
            <a class="download-button col" :href="'https://study-sphere-z8xi.vercel.app/download/' + file._id" target="_blank" :download="file.filename">Download</a>
            <button class="view-button col" @click="openViewModal(file)">View</button>

            <!-- Conditionally render Delete button if user is the file owner -->
            <button v-if="isUserFile(file)" class="delete-button col" @click="deleteFile(file._id)">Delete</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getCurrentUserUid } from '../firebase';  // Import Firebase utility
import { auth } from '../firebase.js'; // Adjust this path to your firebase.js
import { getIdToken } from 'firebase/auth'; // Import getIdToken for token retrieval

export default {
  props: ['showAllNotes', 'searchQuery', 'refreshFiles'],
  data() {
    return {
      files: [],
      userUid: null, // Store the user's UID here
    };
  },
  watch: {
    showAllNotes: 'fetchFiles', // Fetch notes when showAllNotes changes
    refreshFiles: 'fetchFiles',
  },
  mounted() {
    this.fetchFiles();
    this.userUid = getCurrentUserUid();
  },
  computed: {
    // Filter files based on selectedCourseCode and searchQuery (partial match for courseCode)
    filteredFiles() {
      let filtered = this.files;
      if (this.searchQuery) {
        filtered = filtered.filter(file =>
          file.courseCode.toUpperCase().includes(this.searchQuery.toUpperCase()) // Case insensitive partial match
        );
      }
      return filtered;
    },
  },

  methods: {
    //Check if the current file belongs to the logged-in user
    isUserFile(file) {
      return file.userId === this.userUid;  // Assumes that 'uploadedBy' is stored in the file's data
    },
    //Emit event to view modal and pass in file data
    openViewModal(file){
      this.$emit('open-view-modal', file);
    },

    async deleteFile(fileId) {
      console.log(fileId)
      try {
        const response = await axios.delete('https://study-sphere-z8xi.vercel.app/files', {//http://localhost:5000/files
          data: { fileId }  // Send the file's unique ID to delete it
        });
        if (response.status === 200) {
          this.files = this.files.filter(file => file._id !== fileId); // Remove the deleted file from the UI
          alert('File deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting file');
      }
    },

    async fetchFiles() {
      const user = auth.currentUser;//Get current user
      const token = await getIdToken(user);//Retrieve Firebase Id token

      try {
        const url = this.showAllNotes
          ? 'https://study-sphere-z8xi.vercel.app/files'//http://localhost:5000/files
          : 'https://study-sphere-z8xi.vercel.app/files/user-notes';//http://localhost:5000/files/user-notes

        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        this.files = response.data;
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },
  },
};
</script>

<style scoped>
.file-card-list {
  display: flex;
  flex-wrap: wrap;
  /* Wrap cards into multiple rows */
  gap: 15px;
  /* Space between cards */
  margin: 20px 0;
  width: 100%;
  flex-grow: 1;
}

.card {
  width: 200px;
  /* Width of each card */
  border: 1px solid #ccc;
  border-radius: 8px;
  /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Card shadow */
  overflow: hidden;
}

.card-body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  /* Ensure the body stretches to full height */
}

.file-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}


.button-container {
  display: flex;
  gap: 5px;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
}

.download-button,
.view-button,
.delete-button {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-button {
  background-color: #007bff;
}

.download-button:hover {
  background-color: #0056b3;
}

.view-button {
  background-color: #28a745;
}

.view-button:hover {
  background-color: #218838;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  h2{
    margin-top: 8px;
  }
}
</style>
