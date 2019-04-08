import Vue from 'vue';
import Vs from 'd3-vs';
import axios from 'axios';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import App from './App.vue';
import router from './router';

// ACDH AMC variables
// Vue.prototype.$corpusProvider = 'ACDH';
// Vue.prototype.$corpusEngineURI = 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/';

// RAE corpus variables
Vue.prototype.$corpusProvider = 'RAE';
Vue.prototype.$corpusEngineURI = 'http://192.168.3.19:3010/corpus/';

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
