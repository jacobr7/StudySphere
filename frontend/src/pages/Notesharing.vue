<template>
  <div class="note-sharing">
    <Sidebar @open-upload-modal="openUploadModel"/>

    <UploadModal :isVisible="isModalVisible" @close="closeUploadModal"/>

    <!-- Main content Area -->
    <div class="content-area">
      <h1>
        This is where the notes will be displayed as cards 4 per row and
        decreases as size decrease
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Id hic ex totam ea quae facilis velit illo voluptatem aut. Maxime asperiores reiciendis quo error voluptatum similique voluptate velit quis hic?
      </h1>
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
    }
  }
};
</script>

<style scoped>
.note-sharing{
  display: flex;
}

.content-area {
  flex: 1; /* Take up remaining space */
  padding: 20px;
  background-color: #f8f9fa; /* Light background for main content */
  margin-left: 250px;
}
</style>