import Vue from 'vue';
import store from '@/store/store';
import axios from 'axios';
import VoerroTagsInput from '@voerro/vue-tagsinput';

import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';

import exportingModule from 'highcharts/modules/exporting';
import exportDataModule from 'highcharts/modules/export-data';
import moreModule from 'highcharts/highcharts-more';
import mapInit from 'highcharts/modules/map';
import { worldmap } from './worldmap';

import router from './router';

exportingModule(Highcharts);
exportDataModule(Highcharts);
moreModule(Highcharts);
mapInit(Highcharts);
Highcharts.maps.myMapName = worldmap;

Highcharts.setOptions({
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
});

Highcharts.setOptions({
  exporting: {
    buttons: {
      contextButton: {
        menuItems: [
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

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

// Tags input package
Vue.component('tags-input', VoerroTagsInput);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) { return h('router-view'); },
}).$mount('#app');

// CSS Files
// require('../node_modules/@voerro/vue-tagsinput/dist/style.css');
