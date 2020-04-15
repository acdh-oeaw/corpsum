import Vue from 'vue';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';
import offlineExportingModule from 'highcharts/modules/offline-exporting';
import exportDataModule from 'highcharts/modules/export-data';
import wordcloud from 'highcharts/modules/wordcloud';
import treemap from 'highcharts/modules/treemap';
import sankey from 'highcharts/modules/sankey';
import mapInit from 'highcharts/modules/map';
import TextHighlight from 'vue-text-highlight';
import Multiselect from 'vue-multiselect';
import VueTour from 'vue-tour';
import mapAustria from './mapAustria';

import './scss/bootstrap.scss';

import router from './router';
import store from '@/store/store';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('text-highlight', TextHighlight);

exportingModule(Highcharts);
offlineExportingModule(Highcharts);
exportDataModule(Highcharts);
wordcloud(Highcharts);
treemap(Highcharts);
sankey(Highcharts);
mapInit(Highcharts);

Highcharts.maps.geoJSONAustria = mapAustria;


Highcharts.setOptions({
  colors: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#edc948'],
});

Vue.prototype.$chartColors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#edc948'];
Vue.prototype.bus = new Vue();

Highcharts.setOptions({
  credits: false,
});

require('vue-tour/dist/vue-tour.css');

Vue.use(VueTour);

Vue.use(HighchartsVue);

Vue.prototype.Highcharts = Highcharts;

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
