<template>
  <div class="note-sharing">
    <Sidebar v-if="!isSmallScreen" class="sidebar" :refreshSuggestions="refreshSuggestions" @searchQuery="handleSearchQuery" @toggle-notes="toggleNotes" :showAllNotes="showAllNotes" @open-upload-modal="openUploadModel"/>
    <FloatingUploadButton class="highestzindex" v-if="isSmallScreen" @toggle-notes="toggleNotes" :showAllNotes="showAllNotes" @open-upload-modal="openUploadModel"/>

    <UploadModal @file-uploaded="handleFileUploaded" :isVisible="isModalVisible" @close="closeUploadModal"/>
    <ViewModal v-if="viewModalVisible" :file="selectedFile" @close="closeViewModal" />
    <!-- Content Area (No 'main-content' wrapper) -->
    <div :class="['content-area', { 'no-sidebar-margin': isSmallScreen }]">
      <SearchBar v-if="isSmallScreen" class="search-bar-top" :refreshSuggestions="refreshSuggestions" @searchQuery="handleSearchQuery"/>
      <FileList @open-view-modal="openViewModal" :refreshFiles="refreshFiles" :searchQuery="searchQuery" :showAllNotes="showAllNotes"/>
    </div> 
  </div>
</template>

<script>
import FileList from '../components/FileList.vue';
import Sidebar from '../components/Sidebar.vue';
import UploadModal from '../components/UploadModal.vue';
import ViewModal from '../components/ViewModal.vue';
import FloatingUploadButton from '../components/FloatingUploadButton.vue';
import SearchBar from '../components/SearchBar.vue';

export default {
  name: 'Notesharing',
  data(){
    return{
      isModalVisible: false,
      viewModalVisible: false,
      selectedFileForViewing: null,
      showAllNotes: true,//Main state controls whether to show all notes or just the user's notes
      searchQuery: '',
      refreshFiles: false, //Data property to signal FileList,
      refreshSuggestions: false,
      isSmallScreen: window.innerWidth <= 768, // Initial screen size check
    }
  },
  components: {
    SearchBar,
    FloatingUploadButton,
    FileList,
    Sidebar,
    UploadModal,
    ViewModal,
  },
  methods: {
    openUploadModel(){
      this.isModalVisible = true;
    },
    closeUploadModal(){
      this.isModalVisible = false;
    },
    toggleNotes(showAll) {// showAll is the parameter that sidebar.vue emit to which is !this.showAllNotes
      this.showAllNotes = showAll;
    },
    handleSearchQuery(searchQuery){
      this.searchQuery = searchQuery;
    },
    handleFileUploaded(){
      // Trigger Sidebar's suggestion update and FileList refresh
      this.refreshSuggestions = !this.refreshSuggestions; // Toggle to trigger reactivity

      this.refreshFiles = !this.refreshFiles;
    },
    openViewModal(file){
      this.selectedFile = file;
      this.viewModalVisible = true;
    },
    closeViewModal(){
      this.selectedFile = null;
      this.viewModalVisible = false;
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth <= 768; // Update screen size check on resize
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize); // Listen for resize events
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize); // Clean up event listener
  },
};
</script>

<style scoped>
.note-sharing {
  display: flex;
  flex-direction: column;
  height: 100%; 
  flex-grow: 1;
}

.sidebar {
  width: 250px;
  position: fixed;
  top: 80px; /* Align with navbar height */
  height: calc(100vh - 80px);
  background-color: #444;
}

.content-area {
  flex-grow: 1; /* Take up remaining space */
  padding: 20px;
  background-color: #f8f9fa;
  height: calc(100vh - 80px); /* Adjust to ensure it doesn’t exceed the viewport height */
  overflow-y: auto;
}

/* Apply left margin only when sidebar is visible */
.content-area:not(.no-sidebar-margin) {
  margin-left: 250px;
}

/* Remove left margin for smaller screens */
.no-sidebar-margin {
  margin-left: 0;
}

.search-bar-top {
  width: 100%;
  padding: 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: static;
  top: 0;
  z-index: 10;

}

.highestzindex{
  z-index: 15;
}

@media (max-width: 768px) {
  .search-bar-top {
    display: block;
  }
}
</style>
