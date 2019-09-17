// Edit Button top right
// Back Button
// Bottom Bar? 
<template>
    <div id="preview-listing">
        <button @click="goBack" class="universal-back-button">&lt;</button>
       <h2 class="service-name">{{name}} {{type}}</h2>
       <router-link class="edit-listing-now" v-bind:to="{ name: 'edit-listing', params: { editListingID: this.$route.params.previewListingID }}"><i class="fas fa-edit"></i></router-link>
       <section class="listing-info-box">
           <img :src="featuredImageURL" :style="{ backgroundImage: 'url(' + featuredImageURL + ')' }" alt="" class="service-provider-photo">
            <div class="listing-info">
                <!-- <div class="listing-by">by {{provider_name}}</div> -->
                <div class="listing-price">Currently listed for ${{price}}</div>
                <div class="listing-rating" v-html="getStars(4.5)"></div>
                <!-- <div class="chat"><button @click="chatWithProvider" class="btn btn-2 btn-2h">Chat</button></div>  -->
            </div>
            <div class="listing-description">
                <h3><span class="dashed-style">Description</span></h3>
                {{description}}
                <!-- <button class="listing-description-read-more">Read More</button> -->
            </div>
       </section>

        <section class="listing-providers-work">
            <h3><span class="dashed-style">Provider's Work</span></h3>
            <div class="listing-providers-work-images slideScroll">
                
                <LightBox 
        :images="workImages" 
        ref="lightbox"
        :show-light-box="false"
      ></LightBox>
                <li v-for="(image, index) in workImages" style="display: inline-block" :key="index" >
                    <img 
                        v-lazy="image.src" 
                        style="height: 100px" 
                        @click="openGallery(index)"
                    >
                </li>
                <!-- <img v-for="(image,index) in workImages" :id="'work-image-'+index" :src="image.src" :alt="image.alt" :key="image.src" class="listing-providers-work-image" @click="expandImage" /> -->
            </div>

    
    
    <button class="publish" @click="changeStatus('publish')" v-if="this.status=='draft'">Publish</button>
    <button class="activate" @click="changeStatus('active')" v-else-if="this.status=='deactive'">Activate</button>
    <button class="deactivate" @click="changeStatus('deactive')" v-else-if="this.status=='active' || this.status=='publish'">Deactivate</button>

            
        </section>

        
    </div>
</template>

<script>
import Settings from './Settings'
import firebase from 'firebase'
import db from './firebaseInit'
import LightBox from 'vue-image-lightbox'
import { setTimeout } from 'timers';
export default {
    name: 'preview-listing',
    data () {
        return {
            listingsRef: '',
            id: '',
            name: '',
            category: '',
            description: '',
            featuredImageURL: '',
            price: '',
            status: '',
            providerID: null,
            provider_name: '',
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
    beforeRouteEnter (to,from,next) {
        db.collection("listings").where("id","==", to.params.previewListingID).get().then(
            querySnapshot => {
                // console.log(querySnapshot)
                querySnapshot.forEach(doc => {
                    next(vm => {
                        vm.id = doc.data().id
                        vm.name = doc.data().name
                        vm.category = doc.data().category
                        vm.description = doc.data().description
                        vm.featuredImageURL = doc.data().featuredImageURL
                        vm.price = doc.data().price
                        vm.status = doc.data().status
                        vm.providerID = doc.data().providerID
                        vm.provider_name = doc.data().provider_name
                        vm.type = doc.data().type
                        vm.rating = doc.data().rating
                        // GET PHOTO URL WOW!! VM WAS THE PROBLEM
                        vm.getPhotoURL()
                        vm.getWorkImages()
                    })
                })
            }
        )
    },
    created() {
        this.listingsRef = db.collection("listings").doc(this.$route.params.previewListingID)
        this.isFavorited()
    },
     watch: {
    '$route': 'fetchData'
    },
    methods: {
         goBack() {
            window.history.back();
        },
        changeStatus(newStatus) {
            if(newStatus === 'publish') {
                console.log('changing to publish')
                this.listingsRef.set({'status': 'publish'},{merge: true}).then(() => {
                    this.status = 'publish';
                })
            } else if(newStatus === 'active') {
                console.log('changing to active')
                this.listingsRef.set({'status': 'active'},{merge: true}).then(() => {
                    this.status = 'active';
                })
            } else if(newStatus === 'deactive') {
                console.log('changing to publish')
                this.listingsRef.set({'status': 'deactive'},{merge: true}).then(() => {
                    this.status = 'deactive';
                })              
            }
        },
        isFavorited(){
            db.collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
                console.log("isFavorited has run")
                if(doc.data().hasOwnProperty('favorites'))
                if(doc.data().favorites.includes(this.$route.params.previewListingID))
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
                // Alert that we're adding to favorites
                console.log("Adding to favorites!")
                // Finally do the thing
                db.collection("users").doc(firebase.auth().currentUser.uid).update({
                    "favorites": firebase.firestore.FieldValue.arrayUnion(this.$route.params.previewListingID)
                })
            }
            // Else remove current Listing from favorites array of current user! 
            else {
                // Alert that we're removing from favorites
                console.log("Removing from favorites!")
                // Finally do the thing
                db.collection("users").doc(firebase.auth().currentUser.uid).update({
                    "favorites": firebase.firestore.FieldValue.arrayRemove(this.$route.params.previewListingID)
                })
            }

        },

        openGallery(index) {
      this.$refs.lightbox.showImage(index)
    },
        expandImage(e) {
            console.log(e)
            console.log(document.getElementsByClassName("vue-lb-container"));
            // e.srcElement.style.width = "100%";
            // e.srcElement.style.height = "auto";
        },
        revertImage(e) {
            console.log(e)
            // e.srcElement.style.width = "auto";
            // e.srcElement.style.height = "auto";
        },
        getPhotoURL() {
            self = this;
            // this.photoURL = "lol"
            firebase.storage().ref('user-images/'+ self.providerID +'.jpg').getDownloadURL()
            .then(url => {
                 self.providerPhotoURL =  url
            })
            // return firebase.auth().currentUser.photoURL
            
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
.where("id", "==", this.$route.params.previewListingID).get().then(
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
            }
        )

    db.collection("listings").where("category","==",this.category).limit(3).get().then(
        querySnapshot => {
            querySnapshot.forEach(doc => {
                this.similarListings.push(doc.data().name)
            })
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


                // db.collection('chat').doc(this.setChatID(firebase.auth().currentUser.uid,this.provider_uid));
                db.collection('users').doc(firebase.auth().currentUser.uid).update({
                    //     regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")

                        chats: firebase.firestore.FieldValue.arrayUnion(this.setChatID(firebase.auth().currentUser.uid,this.providerID))

                })


                

                db.collection('users').doc(this.providerID).update({
                    //     regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")

                        chats: firebase.firestore.FieldValue.arrayUnion(this.setChatID(firebase.auth().currentUser.uid,this.providerID))

                })
            this.$router.push('/chatbox/'+this.setChatID(firebase.auth().currentUser.uid,this.providerID));

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
</script>

<style scoped>
button {
        padding: 0.5rem 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1.5rem;
    text-align: center;
    /* width: 100%; */
    border-radius: 2px;
    /* margin-top: 1rem; */
    position: fixed;
    bottom: 10%;
    /* right: 50%; */
    left: 50%;
    z-index: 99;
    transform: translateX(-50%);
    color: white;
    text-decoration: none;
    margin: 0 auto;
    display: block;
    margin-top: 1rem;
    border: none;
    font-weight: 400;
    background: #333;
    border-radius: 100px;
}

.universal-back-button {
        position: fixed;
    top: -0.5rem;
    left: 1.5rem;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    line-height: 50px;
    padding: 5px;
    font-weight: bold;
    height: 50px;
}
button.publish, button.activate {
    background-color: green;
}

button.deactivate {
    background: #FF4136;
}
.edit-listing-now {
    position: fixed;
    top: 3%;
    right: 3%;
}

body {
    padding: 0;
    margin: 0;
}

.favorite > i::before {
    font-size: 2rem;
    filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.4)) ;
}

.favorite > .fas.fa-heart::before {
    color: #FF4136;
}

.fa-edit {
    color: white;
    font-size: 2rem;
    
}

#preview-listing { /* Adjust for Top Search Bar and Bottom Menu*/
/* margin: 0 2%; */
    /* margin-top: 50px; */
    /* margin-bottom: 50px; */
    width: 100%;
    /* margin: 0 auto; */
    background-color: rgba(0,31,63,0.8);
    color: #fff;
    padding: 0 5%;
    box-sizing: border-box;
    min-height: 100vh;
    
}

i[class*="fa-star"] {
    font-size: 0.75rem;
}

.work-image {
    margin: 0 0.5rem 0 0;
}

.listing-by, .listing-price {
    font-size: 1.25rem;
    text-align: center;
}
.listing-detail {
    font-size: 1rem;
}

.listing-rating {
    display: flex;
    justify-content: center;
}
.service-provider-photo {
    height: 100;
    width: 100;
    justify-self: center;
    border-radius: 50%;
    grid-column: span 2;
    object-fit: cover;
    object-position: center;
}

.service-name {
    text-align: center;
    margin-top: 4rem;
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
    margin-top: 2rem;
}

.listing-description {
    margin: 0.5rem 0;
    grid-column: span 2;
}

.listing-info {
    /* display: flex;
    flex-direction: column;
    justify-content: center; */
    /* align-items: flex-start; */
    /* margin-left: 5%; */
    grid-column: span 2;
    display: inline;
    margin: 0 auto;
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

</style>





