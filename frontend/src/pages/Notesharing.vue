<template>
  <div class="note-sharing">
    <Sidebar class="sidebar" :refreshSuggestions="refreshSuggestions" @searchQuery="handleSearchQuery" @toggle-notes="toggleNotes" :showAllNotes="showAllNotes" @open-upload-modal="openUploadModel"/>

    <UploadModal @file-uploaded="handleFileUploaded" :isVisible="isModalVisible" @close="closeUploadModal"/>
    <ViewModal v-if="viewModalVisible" :file="selectedFile" @close="closeViewModal" />
    <!-- Content Area (No 'main-content' wrapper) -->
    <div class="content-area">
      <FileList @open-view-modal="openViewModal" :refreshFiles="refreshFiles" :searchQuery="searchQuery" :showAllNotes="showAllNotes"/>
    </div> 
  </div>
</template>

<script>
import FileList from '../components/FileList.vue';
import Sidebar from '../components/Sidebar.vue';
import UploadModal from '../components/UploadModal.vue';
import ViewModal from '../components/ViewModal.vue';

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
    }
  },
  components: {
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
  }
};
</script>

<style scoped>
.note-sharing {
  display: flex;
  height: 100vh; 
}

.sidebar {
  width: 250px;
  position: fixed;
  top: 80px; /* Align with navbar height */
  height: calc(100vh - 80px);
  background-color: #444;
}

.content-area {
  flex: 1; /* Take up remaining space */
  padding: 20px;
  background-color: #f8f9fa;
  margin-left: 250px; /* Align with sidebar width */
  overflow-y: auto; /* Ensure content area scrolls when overflowing */
  height: calc(100vh - 80px); /* Ensure content area takes up the height minus navbar */
}
</style>
