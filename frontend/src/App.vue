<template>
  <div id="app">
    <!-- Top Navigation Bar -->
    <!-- <Navbar/> -->
    <Navbar/>

    <!-- Main Content Area -->
    <div class="marginstuff"> 
      <router-view /> <!-- Current page content will render here -->
    </div> 
      
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
/* for scroll bar on all pages*/
body {
    overflow-y: auto;
    margin: 0;
    padding: 0;
    height: 100%;
}

/* App Container */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar on top */
  height: 100vh;
  padding: 0px;
}

.marginstuff{
  margin-top: 80px;
  flex: 1; /* Make this take up the remaining height */
  display: flex;
  flex-direction: column;
  
}


#room__container {
  position: relative;
  display: grid;
  gap: 3rem;
}

#stream__container {
  justify-self: center;
  width: 100%;
  position: fixed;
  overflow-y: auto;
  height: 100%;
  margin-right: 0;
  margin-bottom: 0;
  background-color: #E5E4E2;
}


#videos__container{
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 225px;
}

.video__container{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #00A3E0;
  border-radius: 10px;
  overflow: hidden;
  height: 200px;
  width: 300px;
}


.video-player {
  height: 100%;
  width: 100%;
}

.video-player video{
  border-radius: 8px;
}

@media (max-width:1400px) {
  .video__container{
    height: 200px;
    width: 300px;
  }
}


@media (max-width: 1200px) {

  #stream__container {
    left: 0;
  }
}

@media (max-width: 980px) {
  #stream__container {
    left: 0;
  }
}

@media (max-width: 768px) {
  #stream__container {
    width: 100%;
  }
  
  .video__container{
    height: 150px;
    width: 225px;
  }
  
  #rooms__container {
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  background-color: #141B4D;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#lobby__form {
  padding: 2em;
}

#rooms__container__header {
  border-radius: 10px 10px 0 0;
  padding: 10px;
  text-align: center;
  background-color: #363739;
  margin: 0;
  font-size: 18px;
  font-size: 300;
  line-height: 0;
}

#rooms{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.carousel-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;
  gap: 20px; /* Adjust for spacing between images */
}

.carousel-item {
  position: relative;
  flex: 0 0 auto;
  width: 250px; /* Adjust width as needed */
  transform: scale(0.9); /* Slightly scale down for effect */
  transition: transform 0.5s ease-in-out, z-index 0.5s ease;
  cursor: pointer;
}

.carousel-item:hover {
  transform: scale(1); /* Scale up when hovered */
  z-index: 10; /* Bring to front */
}

.carousel-item img {
  width: 100%;
  height: auto;
  border-radius: 10px; /* Rounded corners */
}

.carousel-item h3 {
  margin-top: 10px;
  color: #333; /* Adjust text color as needed */
}


}

</style>
