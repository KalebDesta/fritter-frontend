import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import hashtagsPage from './components/hashtags/hashtagsPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import muteTopics from './components/MuteTopics/muteTopics.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/hashtags/:tag',name: 'Hashtags', component: hashtagsPage},
  {path: '/profile/:user',name:'Profile', component: ProfilePage},
  {path: '/muteTopics', name:'muteTopics', component: muteTopics},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    // if(to.name === 'Hashtags' && router.app.$store.state.username) {
    //   next({name: 'Hashtags'}); // Go to Hashtag page if user 
    //   return;
    // }
  }

  next();
});

export default router;
