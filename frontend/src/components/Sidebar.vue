<template>
    <div class="sidebar">

      <div class="top-sidebar">
        <p>Search By Module Name</p>
        <SearchBar/>
      </div>
      <div class="bot-sidebar">
        <button type="button" class="btn btn-primary">
            Your Notes
        </button>
        <button @click="openUploadModel" type="button" class="btn btn-primary">
            Upload Notes
        </button>
        
      </div>

    </div>
  </template>
  
  <script>
  import SearchBar from './SearchBar.vue';

  export default {
    name: 'Sidebar',
    components: {
        SearchBar,
  },
    methods : {
      openUploadModel(){
        this.$emit('open-upload-modal');//Emit event to parent
      }
    }
};

  </script>
  
  <style scoped>
  .sidebar {
    width: 250px; /* Fixed width for the sidebar */
    height: 90%; /* Full height of the main content area */
    background-color: #444;
    color: white;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position:fixed;
    text-align: center;
  }
  
  .sidebar a {
    color: white;
    text-decoration: none;
    display: block; /* Stack links vertically */
    padding: 10px 0;
  }
  
  .sidebar a:hover {
    background-color: #555; /* Highlight on hover */
  }

  button{
    margin: 10px;
  }
  </style>
  