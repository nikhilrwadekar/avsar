<template>
    <!-- header after user logs in -->
         <header>
             <div class="header-ham"><i class="fas fa-bars"></i></div>
             <div class="header-search"><input class="search-input" type="text" v-model="search"><i class="fas fa-search"></i></div>
             <div class="header-chat"><router-link to="/chat"><i class="fas fa-comments"></i></router-link></div>
        </header>

</template>

<script>
import firebase from 'firebase'
export default {
    name: 'app-header',
    data() {
        return {
            //Used for displaying current user.
            user: firebase.auth().currentUser
        }
        
    },

    methods: {
       
    },
    
}

</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    /* position: absolute; */
      position: fixed;
    width: 100%;
    top: 0;
    z-index: 9999;
    background-color: #fff;
    /* align-self: flex-end; */
    /* height: 50px !important; */
    filter:drop-shadow(0px 2px 2px #ddd);
    height: 50px;
}

header .fas {
    color: #333 !important;
    font-size: 1.5rem;
}

header .router-link-active > i {
    color: #003260 !important;
    /* text-align: center; */
    filter:drop-shadow(2px 2px 2px #444);
}

header * {
    /* width: 100%; */
    padding: 2%;
    /* text-align: center; */
}

header .header-search {
    flex-grow: 2;
    flex-basis: 1000px;
    
}
header .search-input {
    width: 90%;
    height: 20px;
    border-radius: 2px;
    padding-left: 30px;
    font-size: 1rem;
}

header .fa-search {
    position: relative;
    top: -35px;
    height: 0;
}
</style>



