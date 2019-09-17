<template>
  <div class="login">
    <div class="form-container">
      <div class="login-logo"><img src="../assets/logo.png" alt=""></div>
      <h3 class="login-title"><span><span class="logo-a">A</span>VSAR</span></span></h3>
      <form action="">
        <div class="login-input-field">
          <i class="fas fa-user form-icon"></i>
          <input type="text" v-model="email" placeholder="Email">
        </div>
        <div class="login-input-field">
          <i class="fas fa-lock-open form-icon"></i>
        <input type="password" v-model="password" placeholder="Password">
        </div>
    
  <transition name="slide-fade">
        <div class="login-buttons">
          <button v-on:click="login" class="button">Login <i class="fas fa-arrow-circle-right"></i></button>
          <div class="registerText">Dont' have an account? <router-link to="/register" class="button register">Create <i class="fas fa-user-plus"></i></router-link></div>
        </div>  
  </transition>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'login',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },

  methods: {
    login: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log(user);
            alert(`Welcome to Avsar, ${user.user.displayName}!`);
            this.$router.push({ path: 'main-menu' })
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    },
    goToRegister() {
       this.$router.push({path: 'register'})
    },
    test() {
      navigator.notification.alert("Window Cordova Navigator");
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.login-logo {
      margin: 0 auto;
  position: relative;
  top: -70px;
  width: 125px;
  height: 125px;
  margin-bottom: -100px;
}

.login-logo img {
  width: 125px;
  height: 125px;
}
template {
  display: flex;
}
.login-title {
  display: block;
  color: #ffffff;
  text-align: center;
  font-size: 2rem;
  line-height: 2rem;
}

.login-title span {
  position: relative;
  filter: drop-shadow(2px 2px 2px #333);
}

.login-title > span {
font-family: 'Merienda', cursive;
}

.login-title .logo-a {
font-size: 3rem;
font-family: 'Merienda', cursive;
}

.login {
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
  background-image: linear-gradient(black, black),url("https://images.unsplash.com/photo-1557722808-868d2424c292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80");
  background-repeat: no-repeat;
  background-position: center;
  background-size:cover; 
  background-blend-mode: saturation;
}
.login form, .login {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-input-field .form-icon {
  font-size: 1.5rem;
  color: white;
  width: 10%;
  text-align: left;
}

.login-input-field {
border-radius: 5px;
background: #003260;
margin-bottom: 0.5rem;
padding: 0 2%;
}

form input {
  border: none;
  font-size: 1.5rem;
  padding: 1% 1rem;
  color: #fff;
  width: 85%;
  background-color: #003260 !important;
}

.register {
  background-color: transparent !important;
  font-size: 1rem !important;
  /* position: absolute;
  bottom: 2rem; */
  /* text-align: center; */
  /* color: #777 !important; */

}
form input, form button, form a {
  border-radius: 5px;
  
}
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

.registerText {
  color: white;
  text-align: center;
  /* background-color: #000; */
}

.form-container {
  background-color: rgba(0,0,0,0.6);
  border-radius: 20px;
  padding: 1rem;
  margin: 1rem;
}
</style>
