<template>
<!-- Main App Component -->
  <div id="app">
    <!-- <AppHeader v-if="['main-menu'].includes($route.name)"/> -->
    <!-- Transistion Effect -->
    <div class="no-internet">You're offline!</div>
    <transition
        name="fade"
        mode="out-in"
      >
      <!-- The Router View Here -->
    <router-view :key="$route.fullPath"/>
     </transition>
     <!-- Render Footer if only its the Main Menu & View Listing Page -->
    <AppFooter v-if="['main-menu', 'favorites', 'settings','chat','view-listings'].includes($route.name)"/>
  </div>
</template>

<script>
import db from './components/firebaseInit'
import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import {firebaseApp} from './components/firebaseInit'
import firebase from 'firebase'
export default {
  name: 'App',
  components: {
    AppFooter, AppHeader
  }
}
</script>

<style>

* {
 /* -webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
-webkit-tap-highlight-color: transparent;  */
outline: none;
transition: all ease 0.15s;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  /* filter: blur(5px); ADD THIS WHEN OFFLINE */
}

.no-internet {
  position: absolute;
    z-index: 99;
    text-align: center;
    /* display: block; */
    font-size: 2rem;
    font-weight: bold;
    font-family: "Poppins";
    background-color: rgba(255,255,0,0.4);
    color: white;
    width: 100%;
    display: none;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.login input:-webkit-autofill,
.login input:-webkit-autofill:hover, 
.login input:-webkit-autofill:focus,
.login textarea:-webkit-autofill,
.login textarea:-webkit-autofill:hover,
.login textarea:-webkit-autofill:focus,
.login select:-webkit-autofill,
.login select:-webkit-autofill:hover,
.login select:-webkit-autofill:focus {
  /* border: 1px solid green; */
  -webkit-text-fill-color: #fff;
  -webkit-box-shadow: 0 0 0px 1000px #001f3f inset;
  transition: background-color 5000s ease-in-out 0s;
}

</style>

