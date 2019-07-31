import Vue from 'vue';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import TextHighlight from 'vue-text-highlight';
import Multiselect from 'vue-multiselect';

import './scss/bootstrap.scss';

import router from './router';
import store from '@/store/store';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('text-highlight', TextHighlight);

Vue.use(BootstrapVue);

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) { return h('router-view'); },
}).$mount('#app');
