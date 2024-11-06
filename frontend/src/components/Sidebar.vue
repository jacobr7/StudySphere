<template>
  <div class="sidebar">

    <div class="top-sidebar">
      <p>Search By Module Name</p>
      <SearchBar />
    </div>
    <div class="bot-sidebar">
      <button @click="toggleNotes" type="button" class="btn btn-primary">
        {{ showAllNotes ? "Show Your Notes" : "Show All Notes" }}
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
  props: ['showAllNotes'],//receive this from parent(notesharing) whether true or false
  name: 'Sidebar',
  components: {
    SearchBar,
  },
  methods: {
    openUploadModel() {
      this.$emit('open-upload-modal');//Emit event to parent
    },
    toggleNotes() {
    this.$emit('toggle-notes', !this.showAllNotes); //sends negated value to the parent component so that the parent can update the state.
  }
  }
};

</script>

<style scoped>
.sidebar {
  color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.top-sidebar {
  flex: 1;
  /* Allows it to grow if needed */
}

.bot-sidebar {
  margin-top: auto;
  /* Pushes bot-sidebar to the bottom */
}

button {
  margin: 10px;
}
</style>
