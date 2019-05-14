import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'http://192.168.3.19:3010/corpus/',
  queryTerms: ['coche', 'carro'],
  rawResults: [],
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
    narrative: {
      categories: [],
      series: [
        {
          name: 'Fiction',
          data: [],
        },
        {
          name: 'Non-Fiction',
          data: [],
        },
      ],
    },
  },
};

export const mutations = {
  updateRawResults(state, payload) {
    state.rawResults.push(payload);
  },
  queryTermAdded(state, queryTerm) {
    state.queryTerms.push(queryTerm);
  },
  queryTermRemoved(state, queryTerm) {
    state.queryTerms.filter(value => value !== queryTerm);
  },
  processTemporal(state, payload) {
    const items = payload.result.data;
    const absolute = { x: [], y: [], name: payload.term };
    const relative = { x: [], y: [], name: payload.term };
    for (let i = 0; i < items.length; i += 1) {
      absolute.x.push(items[i][0]);
      absolute.y.push(items[i][2]);
      relative.x.push(items[i][0]);
      relative.y.push(items[i][1]);
    }
    state.chartData.temporal.absolute.push(absolute);
    state.chartData.temporal.relative.push(relative);
  },
  processRegional(state, payload) {
    /* Update Countries Data */
    const countries = [];
    const itemsCountries = payload.result[1].data;
    for (let i = 0; i < itemsCountries.length; i += 1) {
      countries.push({
        group: payload.term, key: itemsCountries[i][0], value: itemsCountries[i][2], relValue: itemsCountries[i][1],
      });
    }
    // Sort by country
    countries.sort((a, b) => a.key - b.key);
    state.chartData.regional.countries.push(countries);

    /* Update Linguistic Regions Data */
    const regions = state.chartData.regional.regions[0];
    regions.y.push(payload.term);
    regions.z.push([]);
    // Get row key by value
    const tableRow = Object.keys(regions.y).find(key => regions.y[key] === payload.term);
    const itemsRegions = payload.result[7].data;
    for (let i = 0; i < itemsRegions.length; i += 1) {
      regions.x.push(itemsRegions[i][0]);
      regions.z[tableRow].push(itemsRegions[i][1]);
    }
  },
  processDispersion(state, payload) {
    const data = payload.result;
    const dispersion = {
      type: 'scatterpolar',
      r: [],
      theta: ['Year', 'Country', 'Region', 'Narrative Form', 'Medium', 'Theme', 'Year'],
      fill: 'toself',
      name: payload.term,
    };
    const facets = [data[6], data[1], data[7], data[0], data[3], data[4], data[6]];
    for (let i = 0; i < facets.length; i += 1) {
      dispersion.r.push(facets[i].disp);
    }
    state.chartData.dispersion.push(dispersion);
  },
  processNarrative(state, payload) {
    const items = payload.result.data;
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.narrative.series[i].data.push(items[i][2]);
    }
    state.chartData.narrative.categories.push(payload.term);
  },
};

export const getters = {
  chartData: state => state.chartData,
  queryTerms: state => state.queryTerms,
};

export const actions = {
  async corpusQuery({ state, commit, dispatch }, queryTerm) {
    try {
      // const response = await axios.post(`${state.engineAPI}search/`, { corpus: 'corpes', form: [{ word: queryTerm }] });
      const response = { data: { result: 1 } };
      dispatch('corpusQueryData', { term: queryTerm, id: response.data.result });
    } catch (error) {
      console.log(error);
    }
  },
  async corpusQueryData({ state, commit, dispatch }, params) {
    try {
      // const response = await axios.post(`${state.engineAPI}fetch-dists/`, { corpus: 'corpes', fmt: 'json', result: params.id });
      let response;
      if (params.term === 'carro') {
        response = await axios.get('http://www.mocky.io/v2/5cda98bd300000650068c84f');
      } else {
        response = await axios.get('http://www.mocky.io/v2/5cd9913f300000b721c016f4');
      }
      commit('updateRawResults', { term: params.term, result: response.data });
      commit('processTemporal', { term: params.term, result: response.data[6] });
      commit('processRegional', { term: params.term, result: response.data });
      commit('processDispersion', { term: params.term, result: response.data });
      commit('processNarrative', { term: params.term, result: response.data[0] });
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
