<template>
    <div id="view-listing">
       <h2 class="service-name"><button @click="goBack" class="universal-back-button">&lt;</button> {{name}} {{type}}</h2>
       <section class="listing-info-box">
           <img :src="providerPhotoURL" :style="{ backgroundImage: 'url(' + providerPhotoURL + ')' }" alt="" class="service-provider-photo">
            <div class="listing-info">
                <div class="listing-by">by <span class="listing-detail">{{provider_name}}</span></div>
                <div class="listing-price">for <span class="listing-detail">${{price}}</span></div>
                <div class="listing-rating" v-html="getStars(4.5)"></div>
                <div class="chat"><button @click="chatWithProvider" class="listing-contact">Contact</button></div> 
            </div>
            <div class="listing-description">
                <h3><span class="dashed-style">Description</span></h3>
                <div class="listing-description-text">{{description}}</div>
            </div>
       </section>

        <section class="listing-providers-work">
            <h3><span class="dashed-style">Work Showcase</span></h3>
            <div class="listing-providers-work-images slideScroll">
                
                <LightBox 
        :images="workImages" 
        ref="lightbox"
        :show-light-box="false"
      ></LightBox>
                <li v-for="(image, index) in workImages" style="display: inline-block" :key="index" class="work-image" >
                    <img 
                        v-lazy="image.src" 
                        style="height: 100px" 
                        @click="openGallery(index)"
                    >
                </li>
            </div>

            <h3><span class="dashed-style">Similar Listings</span></h3>
            <div class="listing-similar-recommedation-images slideScroll">
                <ul class="similar-listing-list">
                    <li v-for="similarListing in similarListings" :key="similarListing.name">
                        <router-link v-bind:to="{ name: 'view-listing', params: { viewListingID: similarListing.id }}" class="viewlistings-view-listing">
                        <div class="similar-listing-image"><img :src="similarListing.imageURL" alt=""></div>
                        <div class="similar-listing-name">{{similarListing.name}}</div>
                        <div class="similar-listing-price">${{similarListing.price}}</div>
                        <div class="similar-listing-rating" v-html="getStars(Math.floor(Math.random() * 5) + 1)"></div>
                        </router-link>
                    </li>
                </ul>
            </div>
             
        </section>

        <div class="get-in-touch">
            <!-- @click="addToFavorites" -->
            <div class="favorite" @click="toggleFavorite">
                <i v-if="isFavorite" class="fas fa-heart"></i>
                <i v-else class="far fa-heart"></i>
            </div>
            <div class="pay-now" v-if="isHired" @click="payNow()">Hired</div>
            <div class="pay-now" v-else @click="payNow()">Hire Now!</div>
        </div>
        
    </div>
</template>

<script>
import Settings from './Settings'
import firebase from 'firebase'
import db from './firebaseInit'
import LightBox from 'vue-image-lightbox'
import { setTimeout } from 'timers';
const viewlisting = {
    name: 'view-listing',
    data () {
        return {
            id: '',
            name: '',
            category: '',
            description: '',
            featuredImageURL: '',
            price: '',
            status: '',
            providerID: null,
            provider_name: '',
            isHired: false,
            type: '',
            rating: '',
            similarListings: [],
            providerPhotoURL: null,
            workImages: [],
            'fullWidthImage': false,
            isFavorite: false
        }
    },
    components: {
        LightBox
    },
    created() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        this.isFavorited()
        this.fetchData()
    },
     watch: {
    '$route': 'fetchData'
    },
    methods: {
        goBack() {
            this.$router.push('/main-menu');
        },
        getSimilarListings() {
            db.collection("listings").where("category","==",this.category).limit(3).get().then(
        querySnapshot => {
            querySnapshot.forEach(doc => {
                
                const similarListingObject = {
                    id: doc.id,
                    name: doc.data().name,
                    price: doc.data().price,
                    imageURL: doc.data().featuredImageURL,
                }

                if(doc.data().name !== this.name)
                this.similarListings.push(similarListingObject)
            })
        }
    )
        },
        payNow(){
            
            let paymentConfirmation = confirm(`Pay $${this.price} and Hire?`)
            if(paymentConfirmation){
            this.isHired = true;
            this.playAudio('../static/sounds/payment_success.mp3')
            }
        },
        onDeviceReady() {
          alert("Device is ready bawssss")
        },
        playAudio(url) {

            
            var media = new Media(url);
            media.play();
        //   var snd = new Audio(url);
        //     snd.play();
            alert(`Payment Done! ${this.provider_name} will get in touch soon.`)

        },
        isFavorited(){
            db.collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
                if(doc.data().hasOwnProperty('favorites'))
                if(doc.data().favorites.includes(this.$route.params.viewListingID))
                this.isFavorite = true;
            })
        },
        toggleFavorite(){
            this.isFavorite = !this.isFavorite
            this.setFavorite(this.isFavorite)
        },
        setFavorite(value){

            // Add current Listing to favorites Array of current user!
            if(value){
                // Finally do the thing
                db.collection("users").doc(firebase.auth().currentUser.uid).update({
                    "favorites": firebase.firestore.FieldValue.arrayUnion(this.$route.params.viewListingID)
                })
            }
            // Else remove current Listing from favorites array of current user! 
            else {
                // Finally do the thing
                db.collection("users").doc(firebase.auth().currentUser.uid).update({
                    "favorites": firebase.firestore.FieldValue.arrayRemove(this.$route.params.viewListingID)
                })
            }
        },

        openGallery(index) {
      this.$refs.lightbox.showImage(index)
    },
        getPhotoURL() {
            self = this;
            firebase.storage().ref('user-images/'+ self.providerID +'.jpg').getDownloadURL()
            .then(url => {
                 self.providerPhotoURL =  url
            })

            
        },
        getWorkImages(){
            let self = this;
                // Since you mentioned your images are in a folder,
                // we'll create a Reference to that folder:
                var storageRef = firebase.storage().ref("listing-images/"+this.id);


                // Now we get the references of these images
                storageRef.listAll().then(function(result) {
                result.items.forEach(function(imageRef) {
                    // And finally display them
                    displayImage(imageRef);
                });
                }).catch(function(error) {
                // Handle any errors
                });

                function displayImage(imageRef) {
                imageRef.getDownloadURL().then(function(url) {
                    // TODO: Display the image on the UI
                    self.workImages.push({
                        thumb: url,
                        src: url
                    })
                }).catch(function(error) {
                    // Handle any errors
                });
                }
        },
        fetchData () {
            db.collection("listings")
.where("id", "==", this.$route.params.viewListingID).get().then(
            querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.id = doc.data().id
                    this.name = doc.data().name
                    this.category = doc.data().category
                    this.description = doc.data().description
                    this.featuredImageURL = doc.data().featuredImageURL
                    this.price = doc.data().price
                    this.status = doc.data().status
                    this.providerID = doc.data().providerID
                    this.provider_name = doc.data().provider_name
                    this.type = doc.data().type
                    this.rating = doc.data().rating
                })
            this.getPhotoURL()
            this.getWorkImages()
            this.getSimilarListings()
            }
        )

   
        },

        getStars(rating) {
            
            // Round to nearest half
            rating = Math.round(rating * 2) / 2;
            let output = [];

            // Append all the filled whole stars
            for (var i = rating; i >= 1; i--)
                output.push('<i class="fas fa-star" aria-hidden="true" style="color: #f2b01e;"></i>&nbsp;');

            // If there is a half a star, append it
            if (i == .5) output.push('<i class="fas fa-star-half-alt" aria-hidden="true" style="color: #f2b01e;"></i>&nbsp;');

            // Fill the empty stars
            for (let i = (5 - rating); i >= 1; i--)
                output.push('<i class="fas fa-star-o" aria-hidden="true" style="color: #f2b01e;"></i>&nbsp;');

            return output.join('');

            },

        chatWithProvider(){

            let localChatID = this.setChatID(firebase.auth().currentUser.uid,this.providerID)
                // Add to chats array for the current User
                db.collection('users').doc(firebase.auth().currentUser.uid).update({
                        "chats": firebase.firestore.FieldValue.arrayUnion(this.setChatID(firebase.auth().currentUser.uid,this.providerID))
                })

                // Add to chats array for the User that is being contacted
                db.collection('users').doc(this.providerID).update({
                        "chats": firebase.firestore.FieldValue.arrayUnion(this.setChatID(firebase.auth().currentUser.uid,this.providerID))
                })

                let setChatData = {}
                
                setChatData[firebase.auth().currentUser.uid+'_unread'] = 0;
                setChatData[this.providerID+'_unread'] = 0;
                setChatData["names"] = [this.provider_name,firebase.auth().currentUser.displayName];
                setChatData["UIDs"] = [this.providerID,firebase.auth().currentUser.uid];

                db.collection('chats').doc(this.setChatID(firebase.auth().currentUser.uid,this.providerID)).set(setChatData,{merge: true}).then(()=> {
                    this.$router.push('/chatbox/'+this.setChatID(firebase.auth().currentUser.uid,this.providerID));
                })
            

        },
        //set CHAT ID between two parties
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
   
}
document.addEventListener("deviceready", onDeviceReady, false);
export default viewlisting;



</script>

<style scoped>
.universal-back-button {
    /* display: inline; */
    /* width: 50px; */
    position: absolute;
    top: 0;
    left: 0;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    line-height: 50px;
    padding: 5px;
    font-weight: bold;
    height: 50px;
}

body {
    padding: 0;
    margin: 0;
}

.similar-listing-image img {
    max-width: 100%;
    width: 100%;
    height: 100px;
    object-fit: cover;
    object-position: center;
}

.similar-listing-list {
    display: grid;
    list-style-type: none;
    padding-left: 0;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
}

.viewlistings-view-listing {
    text-decoration: none;
    color: white;
}


.favorite > i::before {
    font-size: 2rem;
    filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.4)) ;
}

.favorite > .fas.fa-heart::before {
    color: #FF4136;
}

#view-listing { /* Adjust for Top Search Bar and Bottom Menu*/
/* margin: 0 2%; */
    /* margin-top: 50px; */
    margin-bottom: 50px;
    width: 100%;
    /* margin: 0 auto; */
    background-color: rgba(0,31,63,0.8);
    color: #fff;
    padding: 0 5%;
    box-sizing: border-box;
    min-height: 110vh;
    
}

i[class*="fa-star"] {
    font-size: 0.75rem;
}

.work-image {
    margin: 0 0.5rem 0 0;
}

.listing-by, .listing-price {
    font-size: 0.75rem;
}
.listing-detail {
    font-size: 1rem;
}
.service-provider-photo {
    height: 100;
    width: 100;
    justify-self: center;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
}

.service-name {
    text-align: center;
    position: relative;
    padding: 0.5rem;
}

.slideScroll {
    display: flex;
    overflow: scroll;
    margin: 0;
}

.listing-providers-work-image {
    box-sizing: border-box;
    padding: 4px;
    margin: 0 2%;
    width: 100px;
    object-fit: cover;
    border: 1px solid #777;
    box-shadow: 2px 0px 5px #999;
}

.listing-description-text {
     white-space: pre-wrap;      /* CSS3 */   
   white-space: -moz-pre-wrap; /* Firefox */    
   white-space: -pre-wrap;     /* Opera <7 */   
   white-space: -o-pre-wrap;   /* Opera 7 */    
   word-wrap: break-word;      /* IE */
}

.listing-info-box {
    display: grid;
    grid-template-columns: 1fr 4fr;
}

.listing-description {
    margin: 0.5rem 0;
    grid-column: span 2;
}

.listing-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: flex-start; */
    margin-left: 5%;
}

h3 {
    /* text-align: center; */
    /* border-bottom: 1px solid #444; */
    margin: 0;
    margin-top: 1rem;
}

.dashed-style {
    /* position: relative;
    top: 12px;
    background: #fff;
    padding: 8px; */
    
}

.listing-contact {
    border: none;
    border-radius: 5px;
    font-size: 1.125rem;
    padding: 0.1rem 1rem;
    font-weight: bold;
    filter: drop-shadow(0 2px 2px #333);
    color: white;
    background-color: #207027;
    text-transform: uppercase;
}

.get-in-touch {
    position: fixed;
    bottom: 0; 
    left: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 3fr;
    /* justify-content: space-around; */
    text-align: center;
    background-color: #fff;
    box-shadow: 0px -2px 5px rgba(0,0,0,0.4);
    height: 50px;
    width: 100vw;
}

.get-in-touch > * {
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px solid black; */
    color: black;
}

.pay-now {
    background-color: #207027;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.5rem;
    color: #ffffff;
}

.full {
  width: 75%;
  height: auto;
}

/* Button Styles Imported */

</style>





