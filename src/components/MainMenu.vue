<template>
    <div id="mainmenu">
         <header>
             <!-- <div class="header-first-row"> -->
             <!-- <div class="header-add-listing"><router-link to="/add-listing"><i class="fas fa-plus"></i></router-link></div> -->
             <div class="header-search"><input class="search-input" placeholder="Search Avsar" type="text" v-model="search"><i class="fas fa-search"></i><i @click="clearSearch" v-if="search!==''?true:false" class="fas fa-times-circle"></i></div>
             <div class="header-chat"><router-link to="/chat"><i class="fas fa-comments"><span class="message-unread" v-if="totalUnreadMessages!==0">{{totalUnreadMessages}}</span></i></router-link></div>
             <!-- </div> -->
            
            <ul class="category-list">
                <li v-for="(category, index) in categories" v-bind:key="index" class="category-list-category" v-on:click="categorySearch($event, index)">{{category}}</li>
            </ul>
        </header>
        <ul>
           
            <transition-group name="slide-fade">
            <li v-for="(service) in filteredList" v-bind:key="service.id" class="mainmenu-listing">
               
                <router-link v-bind:to="{ name: 'view-listing', params: { viewListingID: service.id }}" class="mainmenu-view-listing">
                <div class="listing">
                    <img class="mainmenu-listing-photo" :src="service.featuredImageURL" alt="">
                    
                    <div class="mainmenu-listing-info"><span class="mainmenu-listing-info-name">{{service.name}}</span> • <span class="mainmenu-listing-info-price">${{service.price}}</span></div>
                    <div class="mainmenu-listing-provider"> {{service.type}} by {{service.provider_name}} </div>
                    <div class="mainmenu-listing-rating" v-html="getStars(4.5)"></div>
                     
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
// import firebase from 'firebase'
export default {
    name: 'main-menu',
    data () {
        return {
            search: '',
            display: false,
            services: [],
            categories: ["Websites", "IT","Software",
"Mobile","Phones","Computing",
"Writing","Content",
"Design","Media","Architecture",
"Data Entry","Admin",
"Engineering","Science",
"Product Sourcing","Manufacturing",
"Sales","Marketing",
"Freight","Shipping","Transportation",
"Business","Accounting","Human Resources","Legal",
"Translation","Languages",
"Local Jobs","Services",
"Other"],
            totalUnreadMessages: null
        }
    },
    created () {
        console.log("main menu created is run")
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        
        db.collection("chats").where("UIDs","array-contains",firebase.auth().currentUser.uid).onSnapshot(querySnapshot => {
            this.totalUnreadMessages = 0
            let userUnreadTotal = 0;
            // querySnapshot.docChanges().forEach(change => {
            //     if(change.type === "added") {
            //             userUnreadTotal += change.doc.data()[firebase.auth().currentUser.uid+'_unread']
            //     }
            // })
            querySnapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New addition: ", change.doc.data());
            }})

            querySnapshot.forEach(doc => {
                console.log(doc.data()[firebase.auth().currentUser.uid+'_unread'])
                userUnreadTotal += doc.data()[firebase.auth().currentUser.uid+'_unread']
            })
            
            this.totalUnreadMessages = userUnreadTotal
        })

        db.collection('listings').get().then(
            querySnapshot => {
                // console.log(querySnapshot)
                querySnapshot.forEach(doc => {
                    //console.log(doc.id);
                    const data = {
                        'id': doc.id,
                        'services_id' : doc.data().id,
                        'price': doc.data().price,
                        'name': doc.data().name,
                        'rating': doc.data().rating,
                        'category' : doc.data().category,
                        'provider_name' : doc.data().provider_name,
                        'providerID' : doc.data().providerID,
                        'type' : doc.data().type,
                        'featuredImageURL': doc.data().featuredImageURL,
                        'status' : doc.data().status
                    }
                    // console.log(db._config.credentials.currentUser.uid)
                    if(data.status !== 'draft' && data.status !== 'deactive' && data.providerID !== firebase.auth().currentUser.uid)
                    this.services.push(data)
                    //console.log(this.services)
                })
            }
        )

        
    },

    methods : {
        
clearSearch() {
    this.search= ''
},
        categorySearch: function(ev, i){
   console.log(i)
   this.search = this.categories[i]
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
    computed: {
    filteredList() {
      return this.services.filter(service => {
        return (
            service['name'].toLowerCase().includes(this.search.toLowerCase())
        || service['price'].toLowerCase().includes(this.search.toLowerCase()) 
        || service['type'].toLowerCase().includes(this.search.toLowerCase())
         || (service['provider_name']!==null?service['provider_name']:'').toLowerCase().includes(this.search.toLowerCase())
         || service['category'].toLowerCase().includes(this.search.toLowerCase())
        )
      })
    }
  },
  mounted : function() {
// console.log(this.$refs["myid"])
}
    
}
</script>

<style scoped>

.fa-times-circle {
    position: absolute;
    right: 8%;
}
body {
    padding: 0;
    margin: 0;
    transition: all 0.2s ease-in-out;
}
#mainmenu {
    
    margin-top: 80px;
    margin-bottom: 20px;
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

#mainmenu > ul {
    background-color: rgba(0,31,63,0.8);
    width:80%;
    min-height: 100vh;  
    /* margin-top: 100px; */
    /* margin: 0 auto; */
    margin-left: auto;
    margin-right: auto;
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

.mainmenu-listing a {
        text-decoration: none;
        color: black;
        display: flex;
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
        overflow: hidden;
        position: relative;
        
    }

    .mainmenu-listing-photo {
        clip-path: polygon(0 0, 20% 0, 100% 100%, 0% 100%);
        height: 94%;
        width: 50%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 20px 0 0 18px;
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

.mainmenu-listing-info-price {
    display: inline-block;

}

.mainmenu-listing-info {
    font-size: 1.1rem;
    overflow: hidden; 
    font-weight: bold;
    text-transform: capitalize;
    box-sizing: border-box;
   display: inline-block;
   float: right;
}


.listing {
    padding: 2%;
}

/* Header STYLES START */

header {
    /* display: flex;
    justify-content: space-between; */
    position: fixed;
    display: grid;
    grid-template-columns: 1fr 15%;
    /* flex-wrap: wrap; */
    width: 100%;
    top: 0;
    z-index: 9999;
    background-color: #fff;
    /* height: 50px; */
    filter: drop-shadow(0 2px 2px #777)
}

.header-add-listing, .header-search, .header-chat {
    display: flex;
    justify-content: center;
    align-items: center;
}

.fa-comments {
    position: relative;
}
.message-unread {
    background-color: red;
    color: white;
    line-height: 20px;
    height: 20px !important;
    width: 20px !important;
    font-size: 1rem;
    border-radius: 50%;
    text-align: center;
    right: -10;
    top: -5;
    position: absolute;
}
.search-input {
    width: 85%;
    padding-top: 0;
}

.category-list {
    display:flex;
    grid-column: span 3;
    flex-direction: row;
    /* margin-top: 50px; */
    overflow: scroll;
    margin: 0;
    padding: 0;
    padding-left: 0.5rem;
    /* width: 100%; */
    
    height: 50px;
    background-color: #fff;
}

.category-list-category {
    flex-grow: 1;
    flex-shrink: 0;
    /* background: hotpink; */
    margin: 0 2%;
    background-color: #207027;
    color: #fff;
    border-radius: 5px;
    padding: .25rem 1rem;
    /* width: 1000px; */
    /* border-radius: 10px; */
}

header .fas {
    color: #333 !important;
    font-size: 1.5rem;
}

header .router-link-active > i {
    color: #003260 !important;
    /* text-align: center; */
    /* filter:drop-shadow(2px 2px 2px #444); */
}

header * {
    /* width: 100%; */
    padding: 2%;
    /* text-align: center; */
}
header .header-search {
    /* flex-grow: 2; */
    /* flex-basis: 1000px; */
    /* grid-column: span 2; */
    position: relative;
}
header .search-input {
    /* width: %; */
    /* height: 20px; */
    /* border-radius: 2px; */
    padding-left: 30px;
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid #111;

}

header .fa-search {
    position: absolute;
    left: 8%;
    top: 0;
    /* top: -35px; */
    /* height: 0; */
}


header .fa-minus-circle {
    position: absolute;
    right: calc(100%/6);
    top: 0;
    /* top: -35px; */
    /* height: 0; */
}

/* Header STYLES END */

/* 
.mainmenu-listing {
    ui gradient curiosity blue
    
    }

stars {
    rgb(243, 156, 18)
    }

    item {
        border-bottom: 6px solid 111
        }

 */
</style>





