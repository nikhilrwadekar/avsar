// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// Latest Addition: 12th July
import VueLazyLoad from 'vue-lazyload'
import LightBox from 'vue-image-lightbox'
import '../static/fontawesome/css/all.css'
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
require('../static/fonts/Great_Vibes/GreatVibes-Regular.ttf')

Vue.use(VueLazyLoad)
// Vue.use(BootstrapVue)
Vue.config.productionTip = false


/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  data: {
    ready: false,
    lastRoute: null
  },created(){
  },
  methods:{
    init() {
        this.ready = true;
        // alert("LOL WHAT")
        // cordova.navigator.notification.alert("hey cordova works :)")
    },
    onPause() {
      // Handle the pause event
      // this.lastRoute = this.$router.currentRoute;
  },
   onResume() {
    setTimeout(function() {
            // TODO: do your thing!
            // alert("Last router route was: " + this.lastRoute)
        }, 0);
  }
  
  },
  router,
  components: { App,LightBox },
  template: '<App/>'
})

// CORDOVA LISTENERS
document.addEventListener('deviceready', app.init);
document.addEventListener("pause", app.onPause, false);
document.addEventListener("resume", app.onResume, false);






