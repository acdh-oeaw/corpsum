import Vue from 'vue';
import axios from 'axios';
import VoerroTagsInput from '@voerro/vue-tagsinput';

import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import mapInit from 'highcharts/modules/map';
import { worldmap } from './worldmap';

import App from './App.vue';
import router from './router';

stockInit(Highcharts);
mapInit(Highcharts);
Highcharts.maps.myMapName = worldmap;

Vue.use(HighchartsVue);

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
