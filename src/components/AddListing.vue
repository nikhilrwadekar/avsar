<template>
<div class="app-listing-wrapper">
    <div class="add-listing">
        <h1><button @click="goBack" class="universal-back-button">&lt;</button>New Listing</h1>
        <div class="form-data">
        <div class="listing-name-group">
            <label for="listing-name">Title</label>
            <input v-model="lName" type="text">
        </div>

         <div class="listing-type-group">
            <label for="listing-type">Type</label>

            <div>
            <input type="radio" class="form-radio" id="service" name="type" value="Service" checked v-model="lType">
            <span class="service-type" for="service">It's a service</span>
            </div>

            <div>
            <input type="radio" class="form-radio" id="lesson" name="type" value="Lesson" v-model="lType">
            <span class="service-type" for="lesson">It's a lesson</span>
            </div>
        </div>


        <div class="listing-category">
        <label for="">Category</label>
        <select v-model="lCategory" @change="getFeaturedImages($event)">
           <option v-for="category in categories" :key="category">{{category}}</option>
        </select>
        </div>
        

        <div class="listing-description">
            <label for="listing-description">Description</label>
            <textarea v-model="lDescription" name="listing-description" id="" cols="30" rows="5"></textarea>
        </div>

        <div class="listing-featured-image-box">
            <label for="">Featured Image:</label>
            <div v-if="featuredImages.length===0">Select a category first..</div>
            <div class="listing-featured-images" id="listing-featured-images">
                <div v-for="(image, index) in featuredImages" :key="index" :class="{'active': lfeaturedimageSelectedNumber == index}">
                    <img v-on:click="toggle(index)" class="featured-image-selection"  @click="selectFeaturedImage(image.imageURL)" :src="image.imageURL" alt="">
                </div>
            </div>
        </div>

<div class="listing-featured-image-box">
            <label for="">Work Images:</label>
<div id="my-strictly-unique-vue-upload-multiple-image" style="display: flex; justify-content: center;">
    <vue-upload-multiple-image
      @upload-success="uploadImageSuccess"
      @before-remove="beforeRemove"
      @edit-image="editImage"
      :data-images="images"
      idUpload="myIdUpload"
      editUpload="myIdEdit"
      dragText=""
      browseText="Tap to add photos"
      primaryText="for Avsar"
      markIsPrimaryText="for Avsar"
      popupText="Avsar"
      dropText="Drop Images Here"
      ></vue-upload-multiple-image>
      </div>
       </div>

        <div class="listing-price">
            <label for="listing-price">Price</label>
            <input v-model="lPrice" type="number" min="1" max="100">
        </div>

        <div class="listing-buttons">
            <button class="draft" @click="saveAsDraft">
                Draft
            </button>

            <button class="publish" @click="publishNow">
                Publish
            </button>
        </div>

        </div>
    </div>
</div>
</template>

<script>
import firebase from 'firebase'
import db from './firebaseInit'
import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
    name: 'add-listing',
    components: {
    VueUploadMultipleImage,
  },
    data() {
        return {
            listingsRef: '',
            fullDirectory: 'images',
            lName: null,
            lCategory: null,
            lDescription: null,
            lfeaturedimage: null,
            lfeaturedimageSelectedNumber: null,
            lPrice: null,
            lType: null,
            lStatus: null,
            lImageURLs: [],
            images: [
            ],
            featuredImages: [],
            categories: [
                "Websites, IT & Software",
                "Mobile Phones & Computing",
                "Writing & Content",
                "Design, Media & Architecture",
                "Data Entry & Admin",
                "Engineering & Science",
                "Product Sourcing & Manufacturing",
                "Sales & Marketing",
                "Freight, Shipping & Transportation",
                "Business, Accounting, Human Resources & Legal",
                "Translation & Languages",
                "Local Jobs & Services",
                "Other" 
            ]
        }
    },
    created() {
        this.listingsRef = db.collection("listings").doc()
    },
    mounted() {
    },
    methods: {
        goBack() {
            window.history.back();
        },
        getFeaturedImages(event){
                    let index = event.target.selectedIndex;
                    let self = this;
                    this.featuredImages = [];
                        // Since you mentioned your images are in a folder,
                        // we'll create a Reference to that folder:
                        var storageRef = firebase.storage().ref("featured-images");


                        // Now we get the references of these images
                        storageRef.listAll().then(function(result) {
                        result.items.forEach(function(imageRef) {
                            // And finally display them
                            // image name -- websites-1 websites-2 etc watch above line for comment
                            if(imageRef.name.includes(`cat-${index+1}-`))
                            displayImage(imageRef);
                        });
                        }).catch(function(error) {
                        // Handle any errors
                        });

                        function displayImage(imageRef) {
                        imageRef.getDownloadURL().then(function(url) {
                            
                            // TODO: Display the image on the UI
                            self.featuredImages.push({
                            imageURL: url, selected: false
                            })
                        }).catch(function(error) {
                            // Handle any errors
                        });
                        }
                },
            uploadImageSuccess(formData, index, fileList) {
                //Loops over all files in the list. Check if each file is uploaded first, if not then proceed to replace.
                fileList.forEach(file => {
                    
                    var storageRef = firebase.storage().ref("listing-images/"+this.listingsRef.id);
                    storageRef.child(file.name).getDownloadURL().then(onResolve, onReject);

                function onResolve(foundURL) { 
                //File found! Don't do anything.
                } 
                function onReject(error){ 
                //File not found! Proceed to upload.
                storageRef.child(file.name).putString(file.path, 'data_url').then(function(snapshot) {
                });
                }
                })

                
            },
            beforeRemove (index, done, fileList) {
            var r = confirm("Remove Image?")
            if (r == true) {
                done()
            } else {
            }
            },
            editImage (formData, index, fileList) {
            // console.log('edit data', formData, index, fileList)
            },
            uploadImageAsPromise (imageFile,listingID) {
            return new Promise(function (resolve, reject) {
                // Storage Reference for Listing Image
                var storageRef = firebase.storage().ref("listing-images/"+listingID+"/"+imageFile.name);
                
                //Upload file
                var task = storageRef.put(imageFile)
            });
        },
        saveAsDraft() {
            if(firebase.auth().currentUser.uid){
            if(this.lName === null &&
                this.lCategory === null &&
                this.lDescription === null &&
                // this.lfeaturedimage === null &&
                this.lPrice === null)
                alert("Please fill all fields, Thanks!")
                else {
                    this.listingsRef.set({
                        'id' : this.listingsRef.id,
                        'name' : this.lName,
                        'category' : this.lCategory,
                        'description' : this.lDescription,
                        'featuredImageURL' : this.lfeaturedimage,
                        'price' : this.lPrice,
                        'status' : 'draft',
                        'providerID' : firebase.auth().currentUser.uid,
                        'provider_name' : firebase.auth().currentUser.displayName,
                        'type' : this.lType
                        // 'workImageURLs' : data.lImageURLs
                    }).then( () => {
                        //  Router doesnt take you to main menu FIX THIS
                        this.$router.push({ path: '/view-listings' })
                    })                
                }
            }
        },

    publishNow() {
        if(firebase.auth().currentUser.uid){
        if(this.lName === null &&
            this.lCategory === null &&
            this.lDescription === null &&
            this.lfeaturedimage === null &&
            this.lPrice === null &&
            this.lType === null)
            alert("Please fill all fields, Thanks!")
            else {
                //  alert(" all fields filled ")
                  
                 this.listingsRef.set({
                    'id' : this.listingsRef.id,
                    'name' : this.lName,
                    'category' : this.lCategory,
                    'description' : this.lDescription,
                    'featuredImageURL' : this.lfeaturedimage,
                    'price' : this.lPrice,
                    'status' : 'publish',
                    'providerID' : firebase.auth().currentUser.uid,
                    'provider_name' : firebase.auth().currentUser.displayName,
                    'type' : this.lType 
                 }).then( () => {
                    //once listing data is added to firebase SUCCESSFULLY, take the user to MY LISTINGS page
                     this.$router.push({ path: '/view-listings' })
                 })                
            }
        }
    },
    selectFeaturedImage(key) {
        this.lfeaturedimage = key
    },
    toggle: function(index){
    	this.lfeaturedimageSelectedNumber = index
    }
    }
}
</script>

<style scoped>

/* Image Previewer NPM */
.modal-mask {
    height: auto !important;
}

.swipe-container {
    background-color: none !important;
}

/* Image Previewer NPM */


h1 {
    text-align: center;
    font-family: "Great Vibes", cursive;
    font-size: 3rem;
    color: white;
    font-weight: normal;
    margin: 0;
    position: relative;
    padding: 1rem 0;
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


.service-type {
    font-size: 1.25rem;
}
.app-listing-wrapper {
    height: auto;
     justify-content: center;
  align-items: center;
  position: relative;
  /* height: 100vh; */
  background-image: linear-gradient(black, black),url("https://images.unsplash.com/photo-1557722808-868d2424c292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80");
  background-repeat: no-repeat;
  background-position: center;
  background-size:cover; 
  background-blend-mode: saturation;
  background-attachment: fixed;
}



h1 {
    text-align: center;
    /* font-family: "Great Vibes",cursive; */
    font-size: 3rem;
    margin-top: 0;
}

* {
    color: #fff;
}
select {
    background-color: #003260;
}

option {
    color: #fff;
    background-color: rgba(0,31,63,0.8);
    font-size: 1rem;
}

.form-radio
{
     -webkit-appearance: none;
     -moz-appearance: none;
     appearance: none;
     display: inline-block;
     position: relative;
     background-color: #f1f1f1;
     color: #666;
     top: 10px;
     height: 30px;
     width: 30px;
     border: 0;
     border-radius: 50px;
     cursor: pointer;     
     margin-right: 7px;
     outline: none;
}
.form-radio:checked::before
{
     position: absolute;
     font: 1rem/1 'Open Sans', sans-serif;
     left: 11px;
     top: 7px;
     content: '\02143';
     transform: rotate(40deg);
}


select, input, textarea {
    font-size: 1.5rem;
    /* text-align: center; */
}
input, textarea, select {
    border-radius: 10px;
    background: transparent;
    border: 2px solid white;
    padding: 0.5rem 1rem;
}



.listing-featured-images {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
}

.featured-image-selection {
    width: 100%;
}

.add-listing{
    background-color: rgba(0,50,96,0.8);
    width: 90%;
    margin: 0 auto;
}

.form-data > * {
    margin: 1rem;
    display: flex;
    flex-direction: column;
}

.form-data .listing-buttons {
    flex-direction: row;
    justify-content: space-evenly;
    padding-bottom: 1rem;
    margin-bottom: 0;
}

.listing-buttons button {
    flex-grow: 1;

    /* padding: 20px; */
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 2rem;
  text-align: center;
  padding: 0;
  margin: 0;
  text-decoration: none;
  border: none;
  font-weight: bold;
  background: #333;
  border-radius: 5px;
  /* margin: 0 1rem; */
}

.listing-buttons .publish {
    color: white;
    margin-left: 2%;
  background-color: #207027;
}

.preview-work-image {
    width: 100%;
}

#preview {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* grid-template-rows: 100px; */
    grid-gap: 10px;
    overflow: hidden;
    /* height: 100%;
    width: 100%; */
}

#preview img {
  object-fit: cover;
  width: 100%;
  max-height: 100%;
}

label {
    font-weight: bold;
    font-size: 1.5rem;
}

/* CSS for Deselected Image */
.listing-featured-images div.active .featured-image-selection {
    filter: grayscale(0) !important;
    /* filter: drop-shadow(2px 2px 2px #ddd); */
    padding: 1px;
    transform: scale(1.1);

}

/* CSS for Deselected Image */
.listing-featured-images img {
    filter: grayscale(100)
}
</style>
