<template>
    <div class="trailer">
<hooper :itemsToShow="1"  style="height: 100vh; width: 100vw" :infiniteScroll="true" :progress="true" :autoPlay="true">
  <slide :style="{'background-image': 'url(' + require('./../assets/trailerimg1-min.jpg') + ')'}">
    <div class="slide-content">
        Seek services for lower than market price!
    </div>
  </slide>
  <slide :style="{'background-image': 'url(' + require('./../assets/trailerimg2-min.jpg') + ')'}">
    <div class="slide-content">
        Create your first listing today!
    </div>
  </slide>
  <slide :style="{'background-image': 'url(' + require('./../assets/trailerimg3-min.jpg') + ')'}">
    <div class="slide-content">
        Provide services and make a quick buck!
    </div>
  </slide>
  <slide :style="{'background-image': 'url(' + require('./../assets/trailerimg4-min.jpg') + ')'}">
    <div class="slide-content">
        What are you waiting for?
    </div>
  </slide>
  <hooper-pagination slot="hooper-addons"></hooper-pagination>
</hooper>
<!-- <button style="z-index: 2;" @click="test">LOL SSSSSSSSSSSSSSS</button> -->
<div class="button-div"><router-link to="/login" class="button get-started">Get Started <i class="fas fa-arrow-right"></i></router-link></div>
    </div>
</template>

<script>
import {
  Hooper,
  Slide,
  Navigation as HooperNavigation,
    Pagination as HooperPagination

  } from 'hooper';

import 'hooper/dist/hooper.css'

export default {
    name: 'trailer',
    data() {
        return {

        }
    },
    components: {
    Hooper,
    Slide,
    HooperNavigation,
    HooperPagination
  },
  methods: {
    test() {
      alert("Test has been run");
      window.cordova.navigator.notification.alert("Window Cordova Navigator");

    }
  }
}
</script>

<style scoped>

body {
    /* background-color: #000; */
}
.hooper-slide {
    /* background-color: #000; */
    /* background-image: url(http://lorempixel.com/450/800/); */
    /* color: #fff; */
    background-size: cover;
    background-position: center;
    /* height: 900px !important; */
}

.hooper-slide {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    color: #fff;
}

.slide-content {
    background-color: rgba(0,0,0,0.4);
    padding: 2rem;
    width: 100%;
    text-align: center;
}

.button-div {
    z-index: 1;
    height: 20vh;
    width: 100vw;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
}

.get-started {
    color:white;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: #17aa56;
    color: #fff;
    border-radius: 7px;
    
    box-shadow: 0 5px #119e4d;
    padding: 20px 60px 20px 90px;
    text-decoration: none;
}
</style>
