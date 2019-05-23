import Vue from 'vue';
import store from '@/store/store';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import SmartTable from 'vuejs-smart-table'
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';
import exportDataModule from 'highcharts/modules/export-data';
import moreModule from 'highcharts/highcharts-more';
import highcharts3d from 'highcharts/highcharts-3d';
import mapInit from 'highcharts/modules/map';
import { worldmap } from './worldmap';

import './scss/bootstrap.scss';

import router from './router';

exportingModule(Highcharts);
exportDataModule(Highcharts);
moreModule(Highcharts);
highcharts3d(Highcharts);
mapInit(Highcharts);
Highcharts.maps.myMapName = worldmap;

Highcharts.setOptions({
  colors: ['#058DC7', '#50B432', '#DDDF00', '#ED561B', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
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

// Tags input package
Vue.component('tags-input', VoerroTagsInput);

Vue.use(SmartTable)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) { return h('router-view'); },
}).$mount('#app');


