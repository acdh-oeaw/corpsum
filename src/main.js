import Vue from 'vue';
import store from '@/store/store';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import SmartTable from 'vuejs-smart-table'
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';
import offlineExportingModule from 'highcharts/modules/offline-exporting';
import exportDataModule from 'highcharts/modules/export-data';
import dataModule from 'highcharts/modules/data';
import moreModule from 'highcharts/highcharts-more';
import wordcloud from 'highcharts/modules/wordcloud';
import highcharts3d from 'highcharts/highcharts-3d';
import mapInit from 'highcharts/modules/map';
import TextHighlight from 'vue-text-highlight';
import Multiselect from 'vue-multiselect';
import mapAustria from './mapAustria';

import './scss/bootstrap.scss';

import router from './router';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('text-highlight', TextHighlight);

exportingModule(Highcharts);
offlineExportingModule(Highcharts);
exportDataModule(Highcharts);
dataModule(Highcharts);
moreModule(Highcharts);
wordcloud(Highcharts);
highcharts3d(Highcharts);
mapInit(Highcharts);

Highcharts.maps.geoJSONAustria = mapAustria;


Highcharts.setOptions({
  colors: ['#4e79a7', '#edc948', '#e15759', '#76b7b2', '#f28e2b', '#ff9da7', '#FF9655', '#FFF263', '#6AF9C4'],
});

Highcharts.setOptions({
  exporting: {
    buttons: {
      contextButton: {
        menuItems: [
          {
            text: 'Change Types',
            onclick() {
              this.print();
            },
          },
          'printChart',
          'separator',
          'downloadPNG',
          'downloadJPEG',
          'downloadPDF',
          'downloadSVG',
          'separator',
          'downloadCSV',
          'downloadXLS',
          'viewData',
        ],
      },
    },
  },
  credits: false,
});

Vue.use(HighchartsVue);

Vue.prototype.Highcharts = Highcharts;

Vue.use(BootstrapVue);

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(SmartTable);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) { return h('router-view'); },
}).$mount('#app');
