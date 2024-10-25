<template>
  <div>
    <h1>NoteSharing</h1>
    <FileUpload/>
    <FileList/>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'
import FileList from '../components/FileList.vue';

export default {
  name: 'Notesharing',
  components: {
    FileUpload, // Register the FileUpload component
    FileList,
  }
};
</script>
