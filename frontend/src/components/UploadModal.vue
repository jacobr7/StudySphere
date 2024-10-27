<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal">
        <h2>Upload File</h2>
        <form @submit.prevent="handleUpload">
          <div class="form-group">
            <label for="fileName">File Name:</label>
            <input type="text" v-model="fileName" id="fileName" required />
          </div>
  
          <div class="form-group">
            <label for="genre">Genre:</label>
            <input type="text" v-model="genre" id="genre" required />
          </div>
  
          <div class="form-group">
            <label for="file">Select File:</label>
            <input type="file" @change="handleFileChange" id="file" required />
          </div>
  
          <button type="submit">Upload</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: Boolean,
    },
    data() {
      return {
        fileName: '',
        genre: '',
        file: null,
      };
    },
    methods: {
      handleFileChange(event) {
        this.file = event.target.files[0];
      },
      handleUpload() {
        if (this.fileName && this.genre && this.file) {
          const fileData = {
            name: this.fileName,
            genre: this.genre,
            file: this.file,
          };
          this.$emit('upload', fileData);
          this.closeModal();
        }
      },
      closeModal() {
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  </style>
  