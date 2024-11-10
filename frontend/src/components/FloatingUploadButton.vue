<template>
    <div class="floating-upload-container">
      <!-- Main Floating Button -->
      <button class="floating-upload-button" @click="toggleExpanded">
        <span class="plus-icon" v-if="!isExpanded">+</span>
        <span class="close-icon" v-if="isExpanded">×</span>
      </button>
  
      <!-- Expanded Buttons -->
      <div v-if="isExpanded" class="expanded-buttons">
        <button class="upload-option" @click="toggleNotes">
            {{ showAllNotes ? "Your" : "All" }}
        </button>
        <button class="upload-option" @click="openUploadModel">
          <img src="../assets/file.png" alt="Upload">
        </button>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      isExpanded: false, // Tracks whether the button is expanded
    };
  },
  name: 'FloatingUploadButton',
  props: ['showAllNotes', 'refreshSuggestions'],//receive this from parent(notesharing) whether true or false
  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    openUploadModel() {
      this.$emit('open-upload-modal'); // Emit event for Option 1
      this.isExpanded = false; // Optionally collapse after action
    },
    toggleNotes() {
      this.$emit('toggle-notes', !this.showAllNotes); // Emit event for Option 2
    },
  },
};
</script>

<style scoped>
.floating-upload-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.floating-upload-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  z-index: 10;
}

.floating-upload-button:hover {
  background-color: #45a049;
}

.expanded-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.upload-option {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.upload-option img{
    width: 20px;
}

.upload-option:hover {
  background-color: #45a049;
}
</style>