<template>
  <div>
    <h1>About Page</h1>
    <p>This is the About Page.</p>
    <FileUpload/>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'

export default {
  name: 'About',
  components: {
    FileUpload, // Register the FileUpload component
  }
};
</script>
