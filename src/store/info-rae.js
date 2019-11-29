import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'http://192.168.3.19:3010/corpus/',
  infoData: {
    corpusDescription: {
      corpusName: 'CORPES by Real Academia Española',
      corpusLogo: 'https://img.pngio.com/rae-logo-png-png-image-rae-png-824_342.png',
    },
    basicStats: [
      {
        statName: 'Total Documents',
        statValue: '285.000',
      },
      {
        statName: 'Total Tokens',
        statValue: '286 Million',
      },
      {
        statName: 'Total Countries',
        statValue: '23',
      },
    ],
    mostUsed: {
      title: 'Most Used Terms',
      type: 'bar',
      height: 815,
      yAxisText: 'Occurences',
      stacking: 'normal',
      categories: [],
      series: [
        {
          name: 'Occurences',
          data: [],
        },
      ],
    },
    yearsData: {
      title: 'Yearly Partition Sizes',
      yAxisText: 'Number of Tokens',
      height: 400,
      data: [],
    },
    themesData: {
      title: 'Themes of the Corpus',
      yAxisText: 'Number of Tokens',
      stacking: 'normal',
      type: 'column',
      height: 400,
      categories: [],
      series1D: [],
      series2D: [],
    },
  },
};

export const mutations = {
  processMostUsed(state, payload) {
    state.infoData.mostUsed.series[0].data = [];
    state.infoData.mostUsed.categories = [];
    const items = payload.result.values;
    for (let i = 0; i < 30; i += 1) {
      if (items[i].cat !== 'Puntuación' && items[i].cat !== 'Desconocido') {
        state.infoData.mostUsed.series[0].data.push(items[i].count);
        state.infoData.mostUsed.categories.push(items[i].lemma);
      }
    }
  },
  processYears(state, payload) {
    state.infoData.yearsData.data = [];
    const items = payload.result.values;
    const yearlyDocs = { name: 'Tokens', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id !== '?') {
        yearlyDocs.data.push([Number(items[i].id), items[i].count]);
      }
    }
    state.infoData.yearsData.data.push(yearlyDocs);
  },
  processThemes(state, payload) {
    const series1D = {
      name: 'Documents',
      data: [],
    };
    state.infoData.themesData.categories = [];
    const items = payload.result.values;
    for (let i = 0; i < items.length; i += 1) {
      state.infoData.themesData.categories.push(items[i].label);
      series1D.data.push(Number(items[i].count));
    }
    state.infoData.themesData.series1D = series1D;
  },
};

export const getters = {
  infoData: (state) => state.infoData,
};

export const actions = {
  queryCorpusInfo({ state, commit, dispatch }) {
    dispatch('mostUsedQuery');
    dispatch('facetsInfoQuery');
  },
  async mostUsedQuery({ state, commit, dispatch }) {
    try {
      const response = await axios.get('http://www.mocky.io/v2/5ce2d5bd3400005588773779');
      commit('processMostUsed', { result: response.data });
    } catch (error) {
      console.log(error);
    }
  },
  async facetsInfoQuery({ state, commit, dispatch }) {
    try {
      const response = await axios.get('http://www.mocky.io/v2/5ce2dfde34000056887737a0');
      commit('processYears', { result: response.data.facets[1] });
      commit('processThemes', { result: response.data.facets[9] });
    } catch (error) {
      console.log(error);
    }
  },

};

export default {
  state,
  mutations,
  getters,
  actions,
};
