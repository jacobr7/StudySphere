<template>
    <div class="modal" v-if="file">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div>
          <h3>{{ file.filename }}</h3>
          
          <!-- Image Preview for .jpg, .png, .jpeg -->
          <img v-if="file.filename.endsWith('.jpg') || file.filename.endsWith('.png') || file.filename.endsWith('.jpeg')" :src="file.url" alt="File Preview" class="file-preview" />
  
          <!-- PDF Preview for Firebase Storage URL -->
          <iframe 
            v-if="file.filename.endsWith('.pdf')" 
            :src="file.url" 
            width="100%" 
            height="500px" 
            frameborder="0">
          </iframe>
  
          <!-- Handling Text Files or Unsupported Files -->
          <div v-if="isTextFile(file.filename)">
            <p>This is a text file. You can open it in a text viewer.</p>
          </div>
  
          <!-- Fallback for unsupported file types -->
          <div v-if="!isPreviewable(file.filename)">
            <p>Unsupported file type</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['file'],
    methods: {
      closeModal() {
        this.$emit('close'); // Emit an event to close the modal
      },
  
      // Helper method to check if the file is a text file
      isTextFile(filename) {
        return filename.endsWith('.txt') || filename.endsWith('.md') || filename.endsWith('.csv');
      },
  
      // Helper method to check if the file is previewable (image, PDF, text)
      isPreviewable(filename) {
        return (
          filename.endsWith('.jpg') ||
          filename.endsWith('.png') ||
          filename.endsWith('.jpeg') ||
          filename.endsWith('.pdf') ||
          this.isTextFile(filename)
        );
      },
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
    overflow: hidden;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }
  
  .file-preview {
    max-width: 100%;
    height: auto;
  }
  </style>
  