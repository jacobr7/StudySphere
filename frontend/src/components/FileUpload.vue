<template>
  <div>
    <h2>File Upload</h2>
    <input type="file" @change="onFileChange" />
    
    <!-- File Preview Section -->
    <div v-if="previewUrl">
      <h3>Preview:</h3>
      <img v-if="isImage" :src="previewUrl" alt="Image Preview" style="max-width: 300px; max-height: 300px;" />
      <iframe v-if="isPDF" :src="previewUrl" style="width: 100%; height: 500px;" frameborder="0"></iframe>
      <p v-if="isText">Text Preview: {{ textPreview }}</p>
    </div>

    <button @click="uploadFile">Upload</button>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      textPreview: '',
      uploadStatus: '',
      isImage: false,
      isPDF: false,
      isText: false,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];    //event.target refer to file input element which is usually an array

      if (this.selectedFile) {
        // Determine file type for preview
        const fileType = this.selectedFile.type;

        if (fileType.startsWith('image/')) {
          this.isImage = true;
          this.isPDF = false;
          this.isText = false;

          // Create a preview URL for images
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewUrl = e.target.result;
          };
          reader.readAsDataURL(this.selectedFile); // For image preview
        } else if (fileType === 'application/pdf') {
          this.isPDF = true;
          this.isImage = false;
          this.isText = false;

          // Create a preview URL for PDFs
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewUrl = e.target.result;
          };
          reader.readAsDataURL(this.selectedFile); // For PDF preview
        } else if (fileType.startsWith('text/')) {
          this.isText = true;
          this.isImage = false;
          this.isPDF = false;

          // Read the file contents for text preview
          const reader = new FileReader();
          reader.onload = (e) => {
            this.textPreview = e.target.result; // Set text preview
          };
          reader.readAsText(this.selectedFile); // For text file preview
        } else {
          this.previewUrl = null; // Reset if unsupported type
          this.uploadStatus = 'File type not supported for preview.';
        }
      }
    },
    async uploadFile() {
      if (!this.selectedFile) {
        this.uploadStatus = 'Please select a file to upload.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.uploadStatus = `File uploaded successfully: ${response.data.url}`;
      } catch (error) {
        console.error('Error uploading file:', error);
        this.uploadStatus = 'Error uploading file. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
