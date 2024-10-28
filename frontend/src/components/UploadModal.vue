<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <h2>Upload File</h2>
      <form @submit.prevent="handleUpload">
        <div class="form-group">
          <label for="courseCode">Course Code</label>
          <input type="text" v-model="courseCode" placeholder="Enter course code" required />
        </div>
        <div class="form-group">
          <label for="fileInput">Select File</label>
          <input type="file" @change="handleFileChange" required />
        </div>
        <div v-if="previewUrl">
          <h3>Preview:</h3>
          <img v-if="isImage" :src="previewUrl" alt="Image Preview" style="max-width: 300px; max-height: 300px;" />
          <iframe v-if="isPDF" :src="previewUrl" style="width: 100%; height: 400px;" frameborder="0"></iframe>
          <p v-if="isText">Text Preview: {{ textPreview }}</p>
        </div>
        <div class="button-group">
          <button type="submit">Upload</button>
          <button type="button" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      courseCode: '',
      selectedFile: null,
      isImage: false,
      isPDF: false,
      isText: false,
      previewUrl: null,
      textPreview: '',
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];

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
          //onload file after it has been read by filereader
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


    async handleUpload() {
      if (!this.selectedFile) {
        alert('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('courseCode', this.courseCode);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('File uploaded successfully!');
      }
      catch (error) {
        alert('File uploaded failed!');
        console.error('Error uploading file:', error);
      }
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
      this.previewUrl = null;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
