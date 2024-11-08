<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div v-if="file">
          <h3>{{ file.filename }}</h3>
          <p>Course: {{ file.courseCode }}</p>
          <p>Uploaded on: {{ file.createdAt }}</p>
          <!-- You can add more preview content based on file type -->
          <img v-if="file.url.endsWith('.jpg') || file.url.endsWith('.png')" :src="file.url" alt="File Preview">
          <iframe v-if="file.url.endsWith('.pdf')" :src="file.url" width="100%" height="500px"></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['file'],
    methods: {
      closeModal() {
        this.$emit('close');  // Emit an event to close the modal
      }
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 800px;
    width: 80%;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  </style>
  