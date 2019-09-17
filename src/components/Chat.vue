// get chat names and photos
// :src="chattingWithImageURL"
// {{getName(getOtherUserInChat(chat.chatLinkID))}}
<template>
    <div id="chat">
        <h2><button @click="goBack" class="universal-back-button">&lt;</button>Your Chats</h2>
        
            <ul class="chat-list">
                <li v-for="chat in latestChatOnTop" v-bind:key="chat.timeStamp" class="chat-item">
                    <!-- <router-link v-bind:to="{ name: 'view-listing', params: { viewListingID: service.services_id }}" class="mainmenu-view-listing"> -->
                    <router-link class="chat-link" v-bind:to="{ name: 'chatbox', params: { chatboxID: chat.chatLinkID }}">
                    <img :src="chat.imageURL" alt="" class="chat-profile-image">
                    <div class="chat-info">
                        <div class="chat-name-number">
                            <h4 class="chat-with" v-html="chat.chatName"></h4>
                            <div class="chat-unread" v-if="chat.unread > 0">{{chat.unread}}</div>                     
                        </div>
                        
                        <div class="chat-last-message">
                            <div class="chat-last-message-preview">{{chat.previewMessage}}</div>
                            <div class="chat-last-message-time">{{ cleanTime(new Date(chat.timeStamp*1000)) }}</div>
                        </div>
                    </div>
                    </router-link>
                </li>
            </ul>
        
    </div>
</template>

<script>
import db from './firebaseInit'
import firebase from 'firebase'
export default {
    name: 'chat',
    data() {
        return {
            chats: [],
            chattingWith: ''
        }
    },mounted(){
        this.getChatsForUser()
    },
    methods: {
        goBack() {
            window.history.back();
        },
        getOtherUserInChat(chatid) {
            return chatid.replace(firebase.auth().currentUser.uid, '')
        },
        cleanTime(dateTime){
            // dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate() + " " + + ":" + dateTime.getSeconds()       
            return  this.fixTimeZeroes(dateTime.getHours()) + ":" + this.fixTimeZeroes(dateTime.getMinutes())  
        },
        fixTimeZeroes(n){
                return n > 9 ? "" + n: "0" + n;
            },

        getChatsForUser(){ //GET CHATS STARTS
            let self = this;

            // Get CHATS collection 
            db.collection("chats").get().then(querySnapshot => {
                // Go through EACH one by one
                querySnapshot.forEach(doc => {
                    // If doc ID has currently logged-in UID
                    if(doc.id.includes(firebase.auth().currentUser.uid)){
                        let chatData = {}

                        var storageRef = firebase.storage();
                        storageRef.ref('user-images/'+doc.id.replace(firebase.auth().currentUser.uid,'')+'.jpg').getDownloadURL()
                        .then(url => {
                            chatData.imageURL = url;
                        })
                        .catch((error) => {
                            chatData.imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgnDNulNluBZ-CSOvvgMP4BYFDC82RcxlxzWKpRYBiATyG2BOoyg"
                        })
                        .then(() => {
                            db.collection("users").doc(doc.id.replace(firebase.auth().currentUser.uid,''))
                        // Initialize chatData object
                        
                        
                        // Set chatName for Chat
                        doc.data().names.forEach(name => {
                            if(name !== firebase.auth().currentUser.displayName)
                            chatData.chatName = name
                        })
                                    
                        // get Chat ID in chatID
                        const chatID = doc.id

                        db.collection("chats").doc(chatID).get().then(doc => {
                                    chatData.unread = doc.data()[firebase.auth().currentUser.uid+'_unread']
                            })
                                    
                        // Get the latest message from chatID
                        let test = db.collection("chats").doc(doc.id).collection("messages").orderBy("timeStamp", "desc").limit(1).onSnapshot(querySnapshot => {
                            
                            // Assign unread here
                            db.collection("chats").doc(chatID).onSnapshot(doc => {
                                    chatData.unread = doc.data()[firebase.auth().currentUser.uid+'_unread']
                            })

                            
                            querySnapshot.forEach(doc => {
                                
                                // chatData.unread = 0;
                                

                                // Set ChatOBJ
                                let chatObj = {
                                    chatLinkID : chatID,
                                    chattingWith : doc.data().name,
                                    previewMessage : doc.data().content,
                                    timeStamp : doc.data().timeStamp.seconds
                                }
                            
                                // Merge chatData and chat
                                Object.assign(chatData, chatObj);
                                
                                let chatIndex = this.chats.find((chat,index) => {
                                    return chat.chatLinkID == chatData.chatLinkID
                                })

                                // If chat EXISTS replace it with the latest message ELSE push it in CHATS array
                                if((chatIndex !== -1) && (chatIndex !== undefined) ) {
                                    self.chats[chatIndex] = chatData
                                }
                                else {
                                    this.chats.push(chatData)
                                }
                                        

                            })
                        })
                        }) //**************** SECOND THEN ENDS */
                        .catch(error => {
                            // chatData.imageURL = "https://via.placeholder.com/150"
                        });
                        
                        
                    } //IF Ends
                }) //querySnapshor.forEach ENDS
            })
        } //GET CHAT STOPS
    },
    computed: {
        currentTime() {
            let now = new Date();
            return this.fixTimeZeroes(now.getHours()) + ':' + this.fixTimeZeroes(now.getMinutes());
            },
            // This Computed function sorts CHATS based on the latest Timestamp. Meaning latest Chats on TOP!
        latestChatOnTop: function() {
      function compare(a, b) {
        if (a.timeStamp < b.timeStamp)
          return 1;
        if (a.timeStamp > b.timeStamp)
          return -1;
        return 0;
      }

      return this.chats.sort(compare);
    }
        }    
    }

</script>

<style scoped>
h2 {
    text-align: center;
    font-family: "Great Vibes", cursive;
    font-size: 3rem;
    background-color: #003260;
    color: white;
    font-weight: normal;
    margin: 0;
    padding: 1rem 0;
}

.universal-back-button {
    /* display: inline; */
    /* width: 50px; */
    position: absolute;
    /* top: calc(50%-50px); */
    left: 5%;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    line-height: 50px;
    padding: 5px;
    font-weight: bold;
    height: 50px;
}

h4 {
    margin: 0;
}
.chat-list {
    list-style-type: none;
    padding-left: 0;
}

.chat-unread {
    background-color: #FF4136;
    border-radius: 50%;
    padding: 1%;
    height: 25px;
    width: 25px;
    text-align: center;
    align-self: center;
    font-weight: bold;
    color: #ffffff;
}
.chat-link {
    display: grid;
    grid-template-columns: 1fr 2fr;
    text-decoration: none;
    color: #000;
}

.chat-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
}
.chat-profile-image {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: top;
    justify-self: center;
    padding: 10px;
    box-sizing: border-box;
}

.chat-name-number {
    display: flex;
    justify-content: space-between;
}
.chat-item {
    margin: 1rem;
    border-bottom: 1px solid #eee;
    /* box-shadow: 2px 2px 2px #000; */
}

.chat-last-message-preview {
    font-size: 12px;
    color: #aaa;
    font-style: italic;
    /* max-width: 10ch; */
        text-overflow: ellipsis;
    display: inline-block;
    /* OVERFLOW HIDDEN CAUSES THE EXTRA PADDING */
    overflow: hidden;
    height: 19px;    
        vertical-align: top; 

}

.chat-with {
    font-weight: normal;
}

.chat-last-message {
    display: flex;
    padding: 5px;
    justify-content: space-between;
}

.chat-service-details {
    display: flex;
}
</style>

