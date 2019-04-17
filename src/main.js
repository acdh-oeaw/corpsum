import Vue from 'vue';
import Vs from 'd3-vs';
import axios from 'axios';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import App from './App.vue';
import router from './router';

import BillboardChart from '@/components/Chart';
Vue.use(BillboardChart);

// install globally all d3-vs components
Vue.use(Vs);

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
require('../node_modules/billboard.js/dist/billboard.min.css');
