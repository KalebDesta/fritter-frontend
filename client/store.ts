import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // the freets to be displayed for the user
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    // AllFreets:[], //All the freets that have been created
    subscribed:[],
    following:[],
    mutedTopics:[]
  }, 
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/feed';
      const res = await fetch(url).then(async r => r.json());
      const freetsWithTags = [];
      for ( const freet of res ){
        const tags = await fetch(`/api/hashtags?freetId=${freet._id}`).then(async r => r.json());
        freetsWithTags.push({freet:freet, tags:tags});
      }
      state.freets = freetsWithTags;
    },
    async refreshSubscriptions(state){
      const url = `/api/subscribe/`;
      const res = await fetch(url,{
        method: `GET`,
        credentials: 'same-origin'
      }).then(async r => r.json());
      state.subscribed = res.subscribedTo;
    },
    async refreshFollowing(state){
      const url = `/api/follow/`;
      const res = await fetch(url,{
        method: `GET`,
        credentials: 'same-origin'
      }).then(async r => r.json());
      state.following = res.following;
    },
    async refreshMuted(state){
      const url =  `/api/mute-topics`;
      const res = await fetch(url,{
        method: `GET`,
        credentials: 'same-origin'
      }).then(async r => r.json());
      state.mutedTopics = res.mutedTopics;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
