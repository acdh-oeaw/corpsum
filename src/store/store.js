import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chartData: {
      temporal: {
        absolute: [],
        relative: [],
      },
      regional: {
        countries: [],
        regions: [{
          z: [],
          x: [],
          y: [],
          type: 'heatmap',
        }],
      },
      dispersion: [],
      types: [],
    },
  },
  mutations: {
    chartDataUpdate(state, chartData) {
      state.chartData = chartData;
    },
  },
  getters: {
    chartData: state => state.chartData,
  },
});