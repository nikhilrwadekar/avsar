<template>
<!-- Footer after user logs in -->
     <footer>
                <router-link to="/main-menu"><i class="fas fa-home animate"></i></router-link>
                <router-link to="/favorites"><i class="fas fa-heart"></i></router-link>
                <router-link to="/settings"><i class="fas fa-user"></i></router-link>
    </footer> 
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'app-footer'
    }

</script>

<style scoped>

/* Sticky Footer that stays on top of all other elements */
footer {
    display: flex;
    justify-content: space-around;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 9999;
    background-color: #fff;
    filter: drop-shadow(0 -2px 2px #777)
}

footer .fas {
    color: #777 !important;
    font-size: 1.5rem;
}

footer .router-link-active > i {
    color: #003260ee !important;
    filter:drop-shadow(0px 2px 5px #777);
}

footer a {
    width: 100%;
    padding: 2%;
    text-align: center;
}

</style>



