import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    queryTerms: [],
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
    queryTermAdded(state, queryTerm) {
      state.queryTerms.push(queryTerm);
    },
    queryTermRemoved(state, queryTerm) {
      state.queryTerms.filter(value => value !== queryTerm);
    },
  },
  getters: {
    chartData: state => state.chartData,
    queryTerms: state => state.queryTerms,
  },
});
