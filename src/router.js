import Vue from 'vue'
import Router from 'vue-router'
import MainMenu from '@/components/MainMenu'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Favorites from '@/components/Favorites'
import Chat from '@/components/Chat'
import ViewListing from '@/components/ViewListing'
import PreviewListing from '@/components/PreviewListing'
import Settings from '@/components/Settings'
import Trailer from '@/components/Trailer'
import ChatBox from '@/components/ChatBox'
import AddListing from '@/components/AddListing'
import EditListing from '@/components/EditListing'
import ViewListings from '@/components/ViewListings'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/main-menu',
      name: 'main-menu',
      component: MainMenu,
      meta: {
        requiresAuth: true
      }
    },{
      path: '/',
      name: 'trailer',
      component: Trailer,
      meta: {
        requiresGuest: true
      } 
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      } 
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      } 
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: Favorites,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/seeker/:view-seeker-id',
    //   name: 'view-seeker',
    //   component: ViewSeeker
    // },
    // {
    //   path: '/edit/:seeker_id',
    //   name: 'edit-seeker',
    //   component: EditSeeker
    // },
    {
      path: '/chatbox/:chatboxID',
      name: 'chatbox',
      component: ChatBox,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add-listing',
      name: 'add-listing',
      component: AddListing,
      meta: {
        requiresAuth: true
      }
    },
    {
        path: '/view-listing/:viewListingID',
        name: 'view-listing',
        component: ViewListing,
        meta: {
          requiresAuth: true
        } 
      },{
        path: '/view-listings/',
        name: 'view-listings',
        component: ViewListings,
        meta: {
          requiresAuth: true
        } 
      },
      {
        path: '/preview-listing/:previewListingID',
        name: 'preview-listing',
        component: PreviewListing,
        meta: {
          requiresAuth: true
        } 
      },
      {
        path: '/edit-listing/:editListingID',
        name: 'edit-listing',
        component: EditListing,
        meta: {
          requiresAuth: true
        } 
      },
  ]
})

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/main-menu',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});


export default router;