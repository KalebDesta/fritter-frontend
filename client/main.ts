import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// @ts-ignore
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
// @ts-ignore
import VueTagsInput from '@johmun/vue-tags-input';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

Vue.component('v-select', vSelect)
Vue.component('vue-tags-input', VueTagsInput)

