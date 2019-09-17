// ******* FUNCTIONAL *********
// Emoji + Send Button
// Back Button

<template>
    <div class="chatbox">

        <h2 class="chatting-with">
            <div class="">
                <button @click="goBack" class="universal-back-button">&lt;</button>
            </div>
            <div class="">
                <div><span v-if="isOtherPersonOnline" style="color: green;">• </span>{{chattingWith}}</div>
                <div><span v-if="isOtherPersonOnline && isOtherPersonTypingBool" style="color: grey; font-size: 1rem; font-style: italic; font-weight: normal;">typing...</span></div>
            </div>
            <div class="chat-image-container">
                <img :src="chattingWithImageURL" alt="">
            </div>
            
        </h2>
        <!-- <h2 class="chatting-with" v-if="isOtherPersonOnline && !isOtherPersonTypingBool">{{chattingWith}} is in the chat!</h2>
        <h2 class="chatting-with" v-else-if="isOtherPersonOnline && isOtherPersonTypingBool">{{chattingWith}} is typing...</h2>
        <h2 class="chatting-with" v-else-if="!isOtherPersonOnline">Chatting with {{chattingWith}}</h2> -->

        <!-- <h4 class="chatting-with-is-typing" v-if="true">{{chattingWith}} is typing...</h4> -->
        
        
        
        <div class="message-box">
             <ul class="chat-messages">
                 <li :class="[message.email===authUser.email?'message-sent':'message-recieved']" v-for="message in messages" v-bind:key="message.timeStamp.seconds" class="message">
                    <!-- <div v-if="message.email!==authUser.email" class="chat-image-container">
                        <img :src="[message.email===authUser.email?currentUserImageURL:chattingWithImageURL]" alt="">
                    </div> -->
                    <div class="message-group">
                        <!-- <div class="message-person-name" v-if="message.email!==authUser.email">{{message.name}}</div> -->
                        <div class="message-content">{{message.content}}</div>
                        <div class="message-timestamp">{{cleanTime(new Date(message.timeStamp.seconds*1000))}}</div>
                    </div>
                 </li>
             </ul>

             
        </div>

        <div id="scrollTo"></div>
        <div class="message-input">
            <!-- @change="isOtherPersonTyping = false" :input="isTyping()" -->
            <input type="text" class="chat-input"
                v-model="messageBox"
                @input="setPersonTypingStatus(true)"
                @change="setPersonTypingStatus(false)"
                @focus="setPersonTypingStatus(true)"
                @blur="setPersonTypingStatus(false)"
                placeholder="Type your message here.."  v-on:keyup.enter="onEnter">
            <i class="fas fa-chevron-circle-right" @click="onEnter"></i>

        </div>
    </div>
</template>

<script>
import db from './firebaseInit'
import firebase from 'firebase'
export default {
    name: 'chatbox',
    data() {
        return {
            messageBox: '',
            chattingWith: '',
            messages: [],
            authUser: '',
            otherUID_unread_local: '',
            chattingWithImageURL: 'http://lorempixel.com/300/400',
            currentUserImageURL: 'http://lorempixel.com/300/300',
            isOtherPersonOnline: false,
            isOtherPersonTypingBool: false
        }
    },
    beforeRouteEnter(to,from,next) {
        next(vm => {
            // NAV Guard of sorts
            firebase.auth().onAuthStateChanged(user => {
                if(user) {

                    next();
                }

                else {
                    vm.$router.push('/login')
                }
            })
        })
    },
    beforeRouteLeave (to, from, next) {
    next(vm => {
            // NAV Guard of sorts
            vm.setPersonTypingStatus(false)
            // vm.isOtherPersonOnline(false)
            vm.userInChat(false)
        })
  }
    ,
    created(){
        setInterval(window.scrollBy(0,999999999),200)
        this.userInChat(true)
        this.resetUnreadForCurrentUser()


        firebase.auth().onAuthStateChanged(user => {
                if(user) {
                    this.authUser = user;                    
                }

                else {
                    this.authUser = {}
                }
            })
        

        this.getMessages();
        this.setPhotos();
        this.getChattingWithName();
        this.getIsOtherPersonOnline();
        this.getOtherPersonsTypingStatus();
    },
    mounted(){
        window.scrollBy(0,999999999)
    },beforeRouteLeave (to, from , next) {
  this.resetUnreadForCurrentUser()
  this.userInChat(false)
  this.setPersonTypingStatus(false)
  next()
},
    methods: {
        goBack() {
            window.history.back();

        },
        setPersonTypingStatus(value){
            let typingObj = {}
            
                typingObj[firebase.auth().currentUser.uid+'_isTyping'] = value

            // if(this.messageBox !== ''){
            //     typingObj[firebase.auth().currentUser.uid+'_isTyping'] = true
            // }

            // else if(this.messageBox == '') {
            //     typingObj[firebase.auth().currentUser.uid+'_isTyping'] = false
            // }

            db.collection("chats").doc(this.$route.params.chatboxID).set(typingObj,{merge: true})
            
        },
        getOtherPersonsTypingStatus(){
            let self = this;
            db.collection("chats").doc(this.$route.params.chatboxID).onSnapshot(doc => {
                // if(doc.data()[this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+'_isTyping'] !== undefined)
                self.isOtherPersonTypingBool = doc.data()[this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+'_isTyping']
            })
        },
        userInChat(value) {
            // Document reference
            const currentChatRef = db.collection('chats').doc(this.$route.params.chatboxID);

            let isInChatObj = {}
            isInChatObj[firebase.auth().currentUser.uid+ '_isInChat'] = value
            // Update read count
            currentChatRef.update(isInChatObj);
        },
        getChattingWithName() {
            let self = this;
            db.collection('users').doc(this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')).onSnapshot(doc => {
                self.chattingWith = doc.data().fname;
            })
        },
        getIsOtherPersonOnline() {
            let self = this;
            db.collection('chats').doc(this.$route.params.chatboxID).onSnapshot(doc => {
                self.isOtherPersonOnline = doc.data()[this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+'_isInChat'];
            })
        },
        setPhotos(){
          self = this;
            
            firebase.storage().ref('user-images/'+ firebase.auth().currentUser.uid +'.jpg').getDownloadURL()
            .then(url => {
                 self.currentUserImageURL =  url
            })

            firebase.storage().ref('user-images/' + this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+'.jpg').getDownloadURL()
            .then(url => {
                self.chattingWithImageURL = url
            })
        },
        incrementUnreadForOtherUser() {
            const increment = firebase.firestore.FieldValue.increment(1);
            
            // Document reference
            const currentChatRef = db.collection('chats').doc(this.$route.params.chatboxID);

            // Get live inChat boolean
            let otherUserInChat = null;
            currentChatRef.onSnapshot(doc => {
                otherUserInChat = doc.data()[this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+'_isInChat']
        
            })
            let unreadObj = {}

            if(!otherUserInChat)
            unreadObj[this.$route.params.chatboxID.replace(firebase.auth().currentUser.uid,'')+ '_unread'] = increment
            // Update read count
            currentChatRef.update(unreadObj);
        },
        resetUnreadForCurrentUser() {
             const increment = firebase.firestore.FieldValue.increment(1);
            
            // Document reference
            const currentChatRef = db.collection('chats').doc(this.$route.params.chatboxID);

            let unreadObj = {}
            unreadObj[firebase.auth().currentUser.uid+ '_unread'] = 0
            // Update read count
            currentChatRef.update(unreadObj);
        },
        onEnter() {
            
            this.incrementUnreadForOtherUser()
            
            // If messageBox is not empty proceed with updates
            if(this.messageBox) {
            
            // Set a ChatRef
            const chatRef = db.collection('chats').doc(this.$route.params.chatboxID)

            chatRef.set({
                chatexists: true,
        
            },{merge: true})
            db.collection('chats').doc(this.$route.params.chatboxID).collection('messages').add({
                'id' : this.messages.length+1,
                'name' : firebase.auth().currentUser.displayName,
                'email' : firebase.auth().currentUser.email,
                'content' : this.messageBox,
                'timeStamp' : new Date()
            })
            }

            // this.messages.push(newMessage);
            this.messageBox = '';
            window.scrollBy(0,999999999)
        },
        fixTimeZeroes(n){
                return n > 9 ? "" + n: "0" + n;
            },
        currentTime(now) {
            return this.fixTimeZeroes(now.getHours()) + ':' + this.fixTimeZeroes(now.getMinutes()) + ':' + this.fixTimeZeroes(now.getSeconds());
        },
        cleanTime(dateTime){
            if(dateTime.getDate() === new Date().getDate())
            return "Today" + " @ " + this.fixTimeZeroes(dateTime.getHours()) + ":" + this.fixTimeZeroes(dateTime.getMinutes())

            if(dateTime.getDate() === new Date().getDate()-1)
            return "Yesterday" + " @ " + this.fixTimeZeroes(dateTime.getHours()) + ":" + this.fixTimeZeroes(dateTime.getMinutes())

            // return dateTime.getFullYear() + "-" + this.fixTimeZeroes(dateTime.getMonth() + 1) + "-" + dateTime.getDate() + " @ " + this.fixTimeZeroes(dateTime.getHours()) + ":" + this.fixTimeZeroes(dateTime.getMinutes())
            return (new Date().getDate() - dateTime.getDate())+ " days ago" + " @ " + this.fixTimeZeroes(dateTime.getHours()) + ":" + this.fixTimeZeroes(dateTime.getMinutes())
        },
        getMessages(){

            db.collection('chats').doc(this.$route.params.chatboxID).collection('messages').orderBy("timeStamp").onSnapshot(querySnapshot => {
                    let allMessages = [];
                querySnapshot.forEach(doc => {
                    allMessages.push(doc.data())
                    
                })
                
                 

                this.messages = allMessages;
                this.$nextTick(() => {
         // Scroll Down
                 document.getElementById("scrollTo").scrollIntoView();
      })
        
                })

           
        },
        setChatID(uid1,uid2)
        {
        //Check if user1’s id is less than user2's
        if(uid1 < uid2){
        return uid1+uid2;  
        }
        else{
        return uid2+uid1;
        }
        }
    },
    computed: {
        timeNow() {
            return new Date()
        }
    }

}
</script>

<style scoped>
.universal-back-button {
    background: none;
    border: none;
    color: #003260;
    font-size: 3rem;
    line-height: 50px;
    padding: 5px;
    font-weight: bold;
    height: 50px;
}
.chatbox {
    background-color: #eee;
    min-height: 100vh;
}

.chatting-with-is-typing {
    position: fixed;
    z-index: 2;
    top: -30px;
    right: 0;
}

.chatting-with {
    position: fixed;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 1;
    background-color: #fff;
    /* display: block; */
    width: 100%;
    margin: 0;
    filter: drop-shadow(2px 2px 2px #999);
    
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem 3%;
    box-sizing: border-box;
}
.message {
    display: flex;
    /* flex-direction: column; */
    /* border: 1px solid #7FDBFF; */
    color: #111;
    width: 75%;
    /* filter:drop-shadow(2px 2px 2px #999); */
    background-color: #fff;
    border-radius: 25px;
    align-items: center;
    font-size: 1rem;
    margin: 2px 5px;
    /* width: 75%; */
    /* float:right; */
    /* padding: 5px; */
}

.message img {
    width: 50px;
    height: 50px;
    align-self: flex-start;
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    /* outline: 1px solid #fff; */
    /* filter: drop-shadow(1px 1px 1px #999) */
}

.message-group {
       padding: 2% 2rem;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.message-box{
    margin-bottom: 50px;  
}

.message-sent {
/* background-color: #bbb; */
align-self: flex-end;
}

.message-sent .chat-image-container {
order: 1;
display:flex;
align-items: center;
justify-content: flex-end;
width: 25%;
text-align: right;
}

.message-recieved {
    background-color: #efef;
    color: #0074D9;
    /* float: left; */
    /* margin-left: 0; */
    
}
.chat-image-container img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
}
.message-recieved .chat-image-container {
/* order: 1; */
display:flex;
align-items: center;
/* justify-content: flex-end; */
/* width: 35%; */
text-align: right;
}

.message-timestamp {
    font-style: italic;
    font-size: 0.75rem;
    color: #777;
    text-align: right;
}

.message-sent .message-content {
    text-align: right;
}

.message-content {
    /* width: 75%; */
}

.chat-messages {
    display: flex;
    flex-direction: column;
    padding-left: 0;
        background-color: #eee;
    margin-top: calc(50px + 2.25rem );
    }

.message-person-name {
    font-weight: bold;
    font-size: 12px;
    color: #777;
}

.message-input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    /* text-align: center; */
    display: grid;
    grid-template-columns: 5fr 1fr;
    /* flex-grow: 1; */
    /* justify-content: space-around; */
    /* font-size: 1.25rem; */
    padding: 0 2%;
    filter: drop-shadow(0px 4px 6px black);
    background: #fff;
    height: 3rem;
}

.message-input > * {
    font-size: 1.25rem;
    align-self: center;
    width: 100%;
    /* justify-items: center; */
}

.message-input .fas {
    font-size: 2rem;
    color: green;
    text-align: center;
}
</style>
