import Vue from 'vue';
import Vs from 'd3-vs';
import axios from 'axios';
import App from './App.vue';
import router from './router';

// install globally all d3-vs components
Vue.use(Vs);

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render(h) { return h(App); },
}).$mount('#app');
