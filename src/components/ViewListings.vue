<template>
    <div class="view-listings">
        <h1><button @click="goBack" class="universal-back-button">&lt;</button>Your Listings</h1>
        <div class="new-listing"><router-link to="/add-listing"><i class="fas fa-plus"></i></router-link></div>

        <ul>
        <transition-group name="">
            <li v-for="listing in listings" v-bind:key="listing.id" class="viewlistings-listing">
               
                <router-link v-bind:to="{ name: 'preview-listing', params: { previewListingID: listing.id }}" class="viewlistings-view-listing">
                <div class="listing">
                    <img class="viewlistings-listing-photo" :src="listing.featuredImageURL" alt="">
                    
                    <div class="viewlistings-listing-info"><span class="viewlistings-listing-info-name">{{listing.name}}</span> • <span class="viewlistings-listing-info-price">${{listing.price}}</span></div>
                    <div class="viewlistings-listing-provider"> {{listing.type}} by {{listing.provider_name}} </div>
                    <!-- <div class="viewlistings-listing-rating" v-html="getStars(listing.rating)"></div> -->
                     
                </div>
                </router-link>
                
            </li>
            </transition-group>

            </ul>
    </div>
</template>
<script>
import db from './firebaseInit'
import firebase from 'firebase'
export default {
    name: 'view-listings',
    data() {
        return {
            listings: []
        }
    },
    created() {
        db.collection("listings").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().providerID === firebase.auth().currentUser.uid){
                    const listingData = {
                        id: doc.data().id,
                        name: doc.data().name,
                        price: doc.data().price,
                        featuredImageURL: doc.data().featuredImageURL,
                        provider_name: doc.data().provider_name,
                        type: doc.data().type,
                        category: doc.data().category,

                    }

                    this.listings.push(listingData)
                }
            })
        })
    },
    methods: {
        goBack() {
            window.history.back();
        }
    }
}
</script>

<style scoped>
body {
    padding: 0;
    margin: 0;
}

.universal-back-button {
    /* display: inline; */
    /* width: 50px; */
    position: absolute;
    top: calc(50%-50px);
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
.view-listings {
    /* margin-top: 50px;
    margin-bottom: 50px; */
    display: flex;
    flex-direction: column;
      /* min-height: 90vh; */

}

ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.viewlistings-listing {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 90vw;
    margin: 1rem 0%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid #888;
    border-bottom: 5px solid #888;
    height: 100px;
}


.viewlistings-listing-info-name {
     white-space: nowrap;
    max-width: 10ch;
    text-overflow: ellipsis;
    display: inline-block;
    /* OVERFLOW HIDDEN CAUSES THE EXTRA PADDING */
    overflow: hidden;
    /* height: 19px;     */
        vertical-align: top; 
}

.viewlistings-listing a {
        text-decoration: none;
        color: black;
        display: flex;
        /* justify-content: center; */
        height: 100px;
        box-sizing: border-box;
        
    }

    .viewlistings-listing a::after {
        content: ">";
        font-size: 100px;
        font-weight: bold;
        line-height: 50px;
    }

    .viewlistings-view-listing {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
        overflow: hidden;
        position: relative;

    }

    .viewlistings-listing-photo {
        /* clip-path: polygon(0 0, 0% 100%, 100% 100%); */
        clip-path: polygon(0 0, 20% 0, 100% 100%, 0% 100%);
        height: 94%;
        width: 50%;
        position: absolute;
        top: 0;
        left: 0;
        /* z-index: -1; */
        border-radius: 20px 0 0 20px;
        object-fit: cover;
        object-position: top;
    }

.viewlistings-listing-provider {
    font-size: 0.6rem;
    text-align: right;
}

.viewlistings-listing-rating {
    display: inline-block;
    float: right;
    /* filter: drop-shadow( 2px 2px 2px #444); */
}

.viewlistings-listing-info {
    font-size: 1.1rem;
    font-weight: bold;
    
    box-sizing: border-box;
}

.listing {
    padding: 2%;
}

.new-listing {
    font-size: 2rem;
    position: absolute;
    bottom: 50px;
    right: 2%;
    z-index: 999;   
    background-color: #003260;
    /* padding: 1rem 1.5rem; */
    height: 75px;
    width: 75px;
    border-radius: 50%;
    margin-top: 1rem;
}

h1 {
   text-align: center;
    font-family: "Great Vibes", cursive;
    font-size: 3rem;
    background-color: #001f3f;
    color: white;
    font-weight: normal;
    margin: 0;
    padding: 1rem 0;
    position: relative;
}
.new-listing a {
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75px;
    text-decoration: none;
}
</style>
