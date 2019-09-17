// ******* FUNCTIONAL ********
// Get Favorites
// onSnapshot favorites
// Delete (or a Filled heart Icon) to delete favorite
// Favorite onClick takes you to listing

// ******* CSS/CONTENT ********



<template>
    <div id="favorites">
        <h1 class="page-title">Wishlist</h1>
        <ul>
            
            <transition-group name="slide-fade">
            <li v-for="favorite in favorites" v-bind:key="favorite.id" class="mainmenu-listing">
               <!-- {{favorite}} -->
                <router-link v-bind:to="{ name: 'view-listing', params: { viewListingID: favorite.id }}" class="mainmenu-view-listing">
                <div class="listing">
                    <img class="mainmenu-listing-photo" :src="favorite.featuredImageURL" alt="">
                    
                    <div class="mainmenu-listing-info"><span class="mainmenu-listing-info-name">{{favorite.name}}</span> • <span class="mainmenu-listing-info-price">${{favorite.price}}</span></div>
                    <div class="mainmenu-listing-provider"> {{favorite.type}} by {{favorite.provider_name}} </div>
                    <div class="mainmenu-listing-rating" v-html="getStars(4.3)"></div>
                     
                </div>
                </router-link> 
            </li>
            </transition-group>            
        </ul>

        
    </div>
</template>

<script>
import firebase from 'firebase'
import db from './firebaseInit'

export default {
    name: 'favorites',
    data () {
        return {
           favorites: [
                // {       
                //         'id': '011',
                //         'services_id': '011',
                //         'price' : 23,
                //         'name' : "Haircutting",
                //         'rating' : 4.5,
                //         'provider_name' : 'Nikhil Wadekar',
                //         'type' : 'Service'
                // },
                // {       
                //         'id': '012',
                //         'services_id': '012',
                //         'price' : 23,
                //         'name' : "Coding",
                //         'rating' : 4.5,
                //         'provider_name' : 'Nikhil Wadekar',
                //         'type' : 'Lesson'
                // },
                // {       
                //         'id': '013',
                //         'services_id': '013',
                //         'price' : 13,
                //         'name' : "Bhangda",
                //         'rating' : 3.5,
                //         'provider_name' : 'Jasmine Kaur',
                //         'type' : 'Lesson'
                // }
                
                ]
        }
    },
    created(){
            this.fetchData()
            document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        },
     watch: {
    '$route': 'fetchData'
    },
    methods: {
        goBack() {
            window.history.back();
        },
        fetchData() {
            db.collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
                doc.data().favorites.forEach(listingID => {
                     db.collection("listings")
                        .where("id", "==", listingID).get().then(
                                querySnapshot => {
                                    querySnapshot.forEach(doc => {
                                    const listingData = {
                                        id : doc.data().id,
                                        name : doc.data().name,
                                        category : doc.data().category,
                                        description : doc.data().description,
                                        featuredImageURL : doc.data().featuredImageURL,
                                        price : doc.data().price,
                                        status : doc.data().status,
                                        providerID : doc.data().providerID,
                                        provider_name : doc.data().provider_name,
                                        type : doc.data().type,
                                        rating : doc.data().rating,
                                    }

                                    this.favorites.push(listingData)
                                })
                    // this.getPhotoURL()
            }
        )
                })
            })
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
        }
    },
}
</script>

<style scoped>
h1 {
    text-align: center;
    font-family: "Great Vibes", cursive;
    font-size: 3rem;
    /* background-color: #001f3f; */
    color: white;
    font-weight: normal;
    margin: 0;
    padding: 1rem 0;
}

body {
    padding: 0;
    margin: 0;
}
#mainmenu {
    display: flex;
    flex-direction: column;
    }

.page-title {
    color: white;
    position: fixed;
    top: 0;
    font-weight: normal;
    left: 0;
    font-family: "Great Vibes", cursive;
    font-size: 4rem;
    /* margin: 0 auto; */
    text-align: center;
    display: block;
    width: 100%;
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

ul {
    list-style: none;
    padding: 0;
    padding-top: 125px;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    background-color: rgba(0,31,63,0.8);
    width: 100%;
    min-height: 100vh;  
    /* margin-top: 100px; */
    /* margin: 0 auto; */
    margin-left: auto;
    margin-right: auto;
    align-items: center;
}


.mainmenu-listing {
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

.mainmenu-listing-info-name {
     white-space: nowrap;
    max-width: 10ch;
    text-overflow: ellipsis;
    display: inline-block;
    /* OVERFLOW HIDDEN CAUSES THE EXTRA PADDING */
    overflow: hidden;
    /* height: 19px;     */
        vertical-align: top;
}

.mainmenu-listing a {
        text-decoration: none;
        color: black;
        display: flex;
        /* justify-content: center; */
        height: 100px;
        box-sizing: border-box;
}

    .mainmenu-listing a::after {
        content: ">";
        font-size: 100px;
        font-weight: bold;
        line-height: 50px;
}

    .mainmenu-view-listing {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
        position: relative;
}

 .mainmenu-listing-photo {
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

.mainmenu-listing-provider {
    font-size: 0.6rem;
    text-align: right;
}

.mainmenu-listing-rating {
    display: inline-block;
    float: right;
    /* filter: drop-shadow( 2px 2px 2px #444); */
}

.mainmenu-listing-info {
    font-size: 1.1rem;
    font-weight: bold;
    
    box-sizing: border-box;
}

.listing {
    padding: 2%;
}
    


</style>





