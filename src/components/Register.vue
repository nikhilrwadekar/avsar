// NOTES:
// Upload image prevent default
<template>
<!-- Register Component -->
  <div class="register">
    
    <div class="form-container">
      <div class="register-logo"><img src="../assets/logo.png" alt=""></div>
      <h3 class="register-title"><span><span class="logo-a">A</span>VSAR</span></h3>
      <!-- <h3 class="register-title">Sign Up</h3> -->

      <!-- <picture-input 
      ref="pictureInput" 
      @change="onChange" 
      width="150" 
      height="150" 
      margin="16" 
      accept="image/jpeg,image/png" 
      size="10" 
      buttonClass="btn"
      :customStrings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Click here to upload from Gallery!'
      }">
    </picture-input> -->

    <button :style="{ backgroundImage: 'url(' + selectedFile + ')'}" @click.prevent="getCamera" class="camera-button"><i class="fas fa-camera"></i></button>
      <!-- Register Form -->
      <form action="">
        
        <div class="register-name register-combo">
          <i class="fas fa-user form-icon"></i>
          <input class="register-input" type="text" v-model="fname" placeholder="Full Name">
        </div>

        <div class="register-email register-combo">
          <i class="fas fa-envelope form-icon"></i>
          <input class="register-input" type="text" v-model="email" placeholder="Email">
        </div>
        
        <div class="register-password register-combo">
          <i class="fas fa-unlock-alt form-icon"></i>
          <input class="register-input" type="password" v-model="password" placeholder="Password">
        </div>

        <div class="register-confirm-password register-combo">
          <i class="fas fa-unlock-alt form-icon"></i>
        <input class="register-input" type="password" v-model="confirmPassword" placeholder="Confirm Password">
        </div>

        <!-- <input type="file" @change="onFileSelected"> -->
        <!-- <div class="upload-file-group">
          <label for="file">Upload Profile Picture</label>
          <input type="file" @change="onFileSelected" name="lol">
        </div> -->

        <!-- <div class="upload-btn-wrapper">
          <button class="btn">Select Profile Picture</button>
          <input type="file" @change="onFileSelected"/>
        </div> -->
        <div class="login-buttons">
          <button v-on:click.prevent="registerPasswordUser(email,fname,password)" class="button">Register <i class="fas fa-arrow-circle-right"></i></button>
        </div>  
      </form>
    </div>
  </div>
  
  

</template>

<script>
  import firebase from 'firebase';
  import PictureInput from 'vue-picture-input'

  // import axios from 'axios'
  import db from './firebaseInit'
const register = {
  name: 'register',
  data: function() {
    return {
      fname: '',
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      selectedFile: 'wtfman',
      uploadedPhotoURL: '',
      cameraOptions: {
        quality: 40,
        destinationType: Camera.DestinationType.DATA_URL,
        allowEdit: true,
        correctOrientation: true
      }
    };
  },components: {
    PictureInput
  },
  destroyed() {
    navigator.camera.cleanup(onSuccess, onFail);
  },
  methods: {
    cameraCallback(imageData) {
   this.selectedFile = "data:image/jpeg;base64," +imageData;
  //  alert(this.selectedFile)
},
cameraError(error){
  alert(error)
},
getCamera(){
  navigator.camera.getPicture(this.cameraCallback,  this.cameraError, this.cameraOptions);
},
    // onChange (image) {
    //   console.log('New picture selected!')
    //   if (image) {
    //     console.log('Picture loaded.')
    //     this.selectedFile = image
    //     console.log(image)
    //   } else {
    //     console.log('FileReader API not supported: use the <form>, Luke!')
    //   }
    // },
    registerPasswordUser(email,fname,password){

        //Reference this to a variable called self
        var self = this
        //Define user as null
        var user = null;
        //nullify empty arguments
        for (var i = 0; i < arguments.length; i++) {
          arguments[i] = arguments[i] ? arguments[i] : null;
        }
        
        //Attempt to Register
        firebase.auth().createUserWithEmailAndPassword(email, password)
        //If Registration is successful
        .then(function(user) {
          //Set and get firebase storage Reference for the user just created
            var storageRef = firebase.storage().ref('user-images/'+ firebase.auth().currentUser.uid +'.jpg');
            var dbRefUser = firebase.database().ref('users/'+ firebase.auth().currentUser.uid)

            // Set fname and lname for current user
            db.collection("users").doc(firebase.auth().currentUser.uid).set({
              'fname': fname
              // 'lname' : lname
            },{merge: true})

      
            // alert(self.selectedFile)
            // Upload the file to the storage reference
            storageRef.putString(self.selectedFile,"data_url").then(function() {
              
              // console.log(snapshot)
              
              // Log it out in the console
              console.log('Uploaded file for '+user.user.uid+'!');
              }).then(function() {
            // Upload completed successfully, now we can get the download URL
            storageRef.getDownloadURL().then(function(downloadURL) {
                // Store the URL in uploadedFileURL
              self.uploadedPhotoURL = downloadURL;
              // console.log(self.uploadedPhotoURL + downloadURL)

            });
              })

      

              // Assign display name and Photo URL to the user created
              firebase.auth().currentUser.updateProfile({
                displayName: fname,
                photoURL: self.uploadedPhotoURL
              })

            // Finally tell the user that you can log in.
            window.alert("Account created. Welcome to Avsar! :D")
      }).then(()=> {
                self.$router.push({ path: 'main-menu' })
              })
        .catch(function(error) {
          // Alert the user if at all theres any error
          alert(error.message);
        });
},

    login: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log(user);
            alert(`You are logged in as ${user.user.email}`);
            this.$router.push({ path: 'main-menu' })
            // this.$router.go({ path: this.$router.path });
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};

export default register;
</script>

<style scoped>
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
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.register-logo {
  margin: 0 auto;
  position: relative;
  top: -70px;
  width: 125px;
  height: 125px;
  margin-bottom: -100px;
}

.register-logo img {
  width: 125px;
  height: 125px;
}


.register-combo {
  background-color: #003260;
  border-radius: 5px;
      margin-bottom: 0.5rem;
      padding: 0 2%;

}
.picture-preview {
  border-radius: 50% !important;
}
.btn {
  border: 2px solid gray;
  color: gray;
  background-color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.upload-file-group {
  display: flex;
}
body {
  margin: 0;
  padding: 0;
}

.fas {
  padding: 0;
}

.fas::before {
  font-size: 1.25rem;
  
}

.login-title {
  display: block;
  /* color: #ffffff; */
  text-align: center;
  margin: 0;
  font-size: 3rem;
  line-height: 2rem;
}

.register-title{
  display: block;
  color: #ffffff;
  text-align: center;
  /* margin: 0; */
  font-size: 2rem;
  line-height: 2rem;
}

.register-title > span {
font-family: 'Merienda', cursive;
}

.register-title .logo-a {
font-size: 3rem;
font-family: 'Merienda', cursive;
}


.register {
  justify-content: center;
  height: 100vh;
  /* background-image: linear-gradient(black, black),url("https://images.unsplash.com/photo-1557722808-868d2424c292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"); */
  background-image: linear-gradient(black, black),url(https://images.unsplash.com/photo-1557722808-868d2424c292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-blend-mode: saturation;
  /* background-color: #666; */
  /* margin: 0.5rem; */
  /* background-color: hotpink; */
}
.register form, .register {
  display: flex;
  flex-direction: column;
  /* margin-top: 0.5rem; */
}

#image {
  width: 100%;
  margin: 0 auto;
}
.register-input {
    font-size: 1.25rem;
}
input {
  border-radius: 5px;
background: #003260;
margin-bottom: 0.5rem;
padding: 0 2%;
 font-size: 1.25rem;
  /* padding: 1% 1rem; */
  color: #fff;
  width: 75%;
  border: none;
  background-color: #003260 !important;
}

/* .register-buttons {
  display: flex;
  justify-content: space-evenly;
}

.register-buttons .button {
 flex-grow: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  background-color: #001f3f;
  text-align: center;
  color: white;
  padding: 0;
  margin: 0;
  text-decoration: none;
  border: 1px solid black;
  font-size: inherit;
} */

.login-buttons {
  display: flex;
  flex-direction: column;
  
  /* justify-content: space-evenly; */
}

.login-buttons .button {
  flex-grow: 1;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  background-color: #207027;
  text-align: center;
  color: white;
  padding: 0;
  margin: 0;
  text-decoration: none;
  border: none;
  font-size: inherit;
}

.login-buttons .button, .login-buttons a {
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem !important;
}

.form-container {
  background-color: rgba(0,0,0,0.6);
  border-radius: 20px;
  padding: 1rem !important;
  margin: 1rem !important;
}

form * {
  /* margin: 0.25rem; */
  margin: 0;
  padding: 0.5rem;
  font-size: 1rem;
}

.name {
  /* padding: 0;
  margin: 0; */
  /* display: grid; */
  /* grid-template-columns: 1fr 1fr; */
}

form .form-icon {
  /* width: 15%; */
  /* text-align: center; */
   font-size: 1.5rem;
  color: white;
  width: 10%;
  text-align: left;
  /* background-color: #fff; */
}

.name > *{
  width: 85%;
}
</style>
