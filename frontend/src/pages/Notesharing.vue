<template>
  <div class="note-sharing">
    <Sidebar class="sidebar" @toggle-notes="toggleNotes" :showAllNotes="showAllNotes" @open-upload-modal="openUploadModel"/>

    <UploadModal :isVisible="isModalVisible" @close="closeUploadModal"/>

    <!-- Content Area (No 'main-content' wrapper) -->
    <div class="content-area">
      <FileList :showAllNotes="showAllNotes"/>
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue';
import FileList from '../components/FileList.vue';
import Sidebar from '../components/Sidebar.vue';
import UploadModal from '../components/UploadModal.vue';

export default {
  name: 'Notesharing',
  data(){
    return{
      isModalVisible: false,
      showAllNotes: true,//Main state controls whether to show all notes or just the user's notes
    }
  },
  components: {
    FileUpload,
    FileList,
    Sidebar,
    UploadModal,
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
  margin-top: 80px;
  flex: 1; /* Take up remaining space */
  padding: 20px;
  background-color: #f8f9fa;
  margin-left: 250px; /* Align with sidebar width */
  overflow-y: auto; /* Ensure content area scrolls when overflowing */
  height: calc(100vh - 80px); /* Ensure content area takes up the height minus navbar */
}
</style>
