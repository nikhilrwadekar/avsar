// ******* FUNCTIONAL ********
// Clickable Buttons
// Pages for clickable buttons
// Logout Prompt

// ******* CSS/CONTENT ********


<template>
<div class="settings">
    <!-- <h1>Settings Page</h1> -->
    <div class="settings-wrapper">
        <button :style="{ backgroundImage: 'url(' + photoURL + ')'}" @click.prevent="getCamera" class="camera-button settings-profile-image"><i class="fas fa-camera"></i></button>
        <!-- <div class="settings-profile-image" :style="{ backgroundImage: 'url(' + photoURL + ')' }"></div> -->
        <div class="settings-profile-name"><h2 @click="changeDisplayName()">{{currentDisplayName}} <i class="fas fa-edit"></i></h2></div>
        <div class="settings-options">
            <ul>
                <router-link to="/add-listing"><li>Add New Listing<span>></span></li></router-link>
                <router-link to="/view-listings"><li>Your Listings <span>></span></li></router-link>
                <li>Payment Settings <span>></span></li>
                <li>General Settings <span>></span></li>
                <li>Contact Us <span>></span></li>
                <li @click="logout">Logout <span>></span></li>
            </ul>
        </div>
    </div>
 </div>
</template>

<script>
import firebase, { storage } from 'firebase'
export default {
    name: 'settings',
    data() {
        return {
            displayName: null,
            photoURL: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
            cameraOptions: {
                quality: 40,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                correctOrientation: true
            },
            currentDisplayName: this.getDisplayName() 
        }
    },
    created(){
        this.getPhotoURL()
    },
    methods: {
        changeDisplayName(){
        let newFullName = prompt("Full Name:");

        if(newFullName) {
        firebase.auth().currentUser.updateProfile({
                displayName: newFullName
        })

         this.currentDisplayName = newFullName;
         }
        },
        cameraCallback(imageData) {
            let self = this;
            var storageRef = firebase.storage().ref('user-images/'+ firebase.auth().currentUser.uid +'.jpg');
            let photoData = "data:image/jpeg;base64," +imageData;
            storageRef.putString(photoData,"data_url").then(function() {
                self.getPhotoURL()
            })
        },
        cameraError(error){
        alert(error)
        },
        getCamera(){
        navigator.camera.getPicture(this.cameraCallback,  this.cameraError, this.cameraOptions);
        },
        getDisplayName() {
            return firebase.auth().currentUser.displayName
        },
        getPhotoURL() {
            self = this;
            // this.photoURL = "lol"
            firebase.storage().ref('user-images/'+ firebase.auth().currentUser.uid +'.jpg').getDownloadURL()
            .then(url => {
                 self.photoURL =  url
            })
            // return firebase.auth().currentUser.photoURL
            
        },
        logout() {
            if(confirm("Are you Sure?")){
            firebase.auth().signOut().then(() => {
  // Sign-out successful.
            this.$router.push('/login')
}).catch(function(error) {
  // An error happened.
  alert(error)
});}
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none;
}
.fa-camera {
    position: absolute;
    bottom: 0;
    right: 10%;
    font-size: 2rem;
}

.camera-button {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100px;
  /* background: url(http://lorempixel.com/500/500); */
  width: 100px;
  margin: 0 auto;
 border-radius: 50%;
 display: block;
 /* background: none; */
 border: 2px solid white;
 color: white;
}
.settings {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 101vw;
    margin: 0 auto;
    /* background: url("https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80"); */
    background-image: linear-gradient(black, black),url("https://images.unsplash.com/photo-1466786784937-3e682c802b14?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80");
    background-position: center;
    background-size: cover;
    background-blend-mode: saturation;
    backdrop-filter: blur(2px);

}

.settings-wrapper {
    /* display: flex;
    background-color: #555;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90vw;
    margin: 0 auto; */

     background-color: rgba(0,0,0,0.6);
  border-radius: 20px;
  padding: 1rem;
  margin: 1rem;

}
.settings-profile-image {
    border-radius: 50%;
    height: 150px;
    width: 150px;
    position: relative;
    top: -100px;
    
    background-image: url(https://picsum.photos/150);
    margin: 0 auto;
    background-size: cover;
}

.settings-switch > ul {
    padding-left: 0;
    /* padding: 1.5%; */
    font-size: 1.5rem;
    font-weight: bold;
    /* width: 100%; */
}
.settings-options {
    width: 100%;
}
.settings-options ul {
    padding-left: 0;
    /* width: 80vw; */
}
.settings-options ul li {
    padding: 0.5rem 1rem;
    padding-left: 2rem;
    display: grid;
    grid-template-rows: repeat(1fr, 5);
    grid-template-columns: 4fr 1fr;
    /* border: 1px solid #ddd; */
    border-radius: 1rem;
    /* display: block; */
    list-style-type: none;
    width: 90vw;
    box-sizing: border-box;
    margin: 0.5rem -2rem;
    background-color: #003260;
    color: white;
    font-size: 1.125rem;
}

.settings-options ul li>span {
    display: flex;
    justify-content: center;
}


h2 {
    font-weight: bold;
    text-align: center;
    color: #ffffff;
    margin-top: -100px;
}
</style>


