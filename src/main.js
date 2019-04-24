import Vue from 'vue';
import axios from 'axios';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import App from './App.vue';
import router from './router';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

// Tags input package
Vue.component('tags-input', VoerroTagsInput);

Vue.config.productionTip = false;

new Vue({
  router,
  render(h) { return h(App); },
}).$mount('#app');

// CSS Files
// require('../node_modules/@voerro/vue-tagsinput/dist/style.css');
