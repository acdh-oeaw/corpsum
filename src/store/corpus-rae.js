import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'http://192.168.3.19:3010/corpus/',
  queryTerms: [],
  rawResults: [],
  chartData: {
    absolute: {
      title: 'Yearly Absolute Frequencies',
      yAxisText: 'Number of Hits',
      data: [],
    },
    relative: {
      title: 'Yearly Relative Frequencies',
      yAxisText: 'Number of Hits per Million Words',
      data: [],
    },
    countries: {
      title: 'Countries',
      type: 'column',
      stacking: 'percent',
      yAxisText: 'Relative Frequencies',
      categories: ['Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'España', 'Estados Unidos', 'Filipinas', 'Guatemala', 'Guinea Ecuatorial', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'],
      series1D: [],
      series2D: [],
    },
    regions: {
      categoriesX: [
        'Andina',
        'Antillas',
        'Caribe continental',
        'Chilena',
        'España',
        'Estados Unidos',
        'Filipinas',
        'Guinea Ecuatorial',
        'México y Centroamérica',
        'Río de la Plata',
      ],
      categoriesY: [],
      data: [],
    },
    dispersion: {
      categories: ['Year', 'Country', 'Linguistic Region', 'Narrative Form', 'Medium', 'Theme'],
      series: [],
    },
    narrative: {
      title: 'Narrative Forms',
      type: 'column',
      yAxisText: 'Percentage of Absolute Frequencies',
      stacking: 'percent',
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
    kwic: {
      items: [],
      fields: [
        { key: 'year', label: 'Year', sortable: true },
        { key: 'doc', label: 'Document ID', sortable: true },
        { key: 'country', label: 'Country', sortable: true },
        {
          key: 'left', label: 'Left', sortable: true, class: 'text-right',
        },
        {
          key: 'term', label: 'Term', sortable: true, class: 'text-center',
        },
        {
          key: 'right', label: 'Right', sortable: true, class: 'text-left',
        },
      ],
      height: 600,
    },
  },
};

export const mutations = {
  resetQueryTerms(state, payload) {
    state.queryTerms = payload;
    console.log(payload);
  },
  resetChartData(state, payload) {
    state.chartData = payload;
    console.log(payload);
  },
  updateRawResults(state, payload) {
    state.rawResults.push(payload);
  },
  queryTermAdded(state, queryTerm) {
    state.queryTerms.push(queryTerm);
  },
  queryTermRemoved(state, queryTerm) {
    state.queryTerms.filter((value) => value !== queryTerm);
  },
  processTemporal(state, payload) {
    const items = payload.result.data;
    const absolute = { name: payload.term, data: [] };
    const relative = { name: payload.term, data: [] };
    for (let i = 0; i < items.length; i += 1) {
      absolute.data.push([Number(items[i][0]), items[i][2]]);
      relative.data.push([Number(items[i][0]), Math.round(items[i][1])]);
    }
    state.chartData.temporal.absolute.data.push(absolute);
    state.chartData.temporal.relative.data.push(relative);
  },
  processRegional(state, payload) {
    /* Update Countries Data */
    const series1D = {
      name: payload.term,
      data: [],
    };
    const series2D = {
      name: payload.term,
      data: [],
    };
    const { countries } = state.chartData.regional;
    const itemsCountries = payload.result[1].data;
    for (let i = 0; i < itemsCountries.length; i += 1) {
      const categoriesKey = Object.keys(countries.categories).find((key) => countries.categories[key] === itemsCountries[i][0]);
      series1D.data[categoriesKey] = itemsCountries[i][1];
      series2D.data[categoriesKey] = [itemsCountries[i][1], itemsCountries[i][2]];
    }
    state.chartData.regional.countries.series1D.push(series1D);
    state.chartData.regional.countries.series2D.push(series2D);

    /* Update Linguistic Regions Data */
    const { regions } = state.chartData.regional;
    regions.categoriesY.push(payload.term);
    const categoriesYKey = Object.keys(regions.categoriesY).find((key) => regions.categoriesY[key] === payload.term);
    const itemsRegions = payload.result[7].data;
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i][0];
      const categoriesXKey = Object.keys(regions.categoriesX).find((key) => regions.categoriesX[key] === regionName);
      if (categoriesXKey) {
        regions.data.push([Number(categoriesXKey), Number(categoriesYKey), Math.round(itemsRegions[i][1])]);
      }
    }
  },
  processDispersion(state, payload) {
    const data = payload.result;
    const dispersion = {
      name: payload.term,
      data: [],
      pointPlacement: 'on',
    };
    const facets = [data[6], data[1], data[7], data[0], data[3], data[4]];
    for (let i = 0; i < facets.length; i += 1) {
      dispersion.data.push(facets[i].disp);
    }
    state.chartData.dispersion.series.push(dispersion);
  },
  processNarrative(state, payload) {
    const items = payload.result.data;
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.narrative.series[i].data.push(items[i][2]);
    }
    state.chartData.narrative.categories.push(payload.term);
  },
  processKWIC(state, payload) {
    const items = payload.result.values;
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.kwic.items.push(
        {
          year: items[i].year, doc: items[i].doc, country: items[i].country, left: items[i].left, term: items[i].center, right: items[i].right,
        },
      );
    }
  },
};

export const getters = {
  chartData: (state) => state.chartData,
  queryTerms: (state) => state.queryTerms,
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
      let kwicResp;
      if (params.term === 'carro') {
        response = await axios.get('http://www.mocky.io/v2/5cda98bd300000650068c84f');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a1403100007c00742761');
      } else if (params.term === 'coche') {
        response = await axios.get('http://www.mocky.io/v2/5cd9913f300000b721c016f4');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce39b383100007800742726');
      } else if (params.term === 'auto') {
        response = await axios.get('http://www.mocky.io/v2/5ce3c8c031000062387428d4');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3c8fe31000078007428d8');
      } else if (params.term === 'teléfono celular') {
        response = await axios.get('http://www.mocky.io/v2/5ce3a4603100005a00742780');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a5243100004c00742785');
      } else if (params.term === 'teléfono móvil') {
        response = await axios.get('http://www.mocky.io/v2/5ce3a5713100007800742789');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a5a33100000e0074278a');
      } else if (params.term === 'SIDA') {
        response = await axios.get('http://www.mocky.io/v2/5ce3a69c3100005b00742795');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a6dd3100004c00742796');
      } else if (params.term === 'Sida') {
        response = await axios.get('http://www.mocky.io/v2/5ce3a7443100007c00742797');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a76f3100000e0074279a');
      } else if (params.term === 'sida') {
        response = await axios.get('http://www.mocky.io/v2/5ce3a7b73100005a0074279f');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3a7e43100005b007427a4');
      } else if (params.term === 'Iker') {
        response = await axios.get('http://www.mocky.io/v2/5ce3aaf63100007c007427ba');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3ab4e3100007c007427c1');
      } else if (params.term === 'Hugo') {
        response = await axios.get('http://www.mocky.io/v2/5ce3ab9031000078007427c5');
        kwicResp = await axios.get('http://www.mocky.io/v2/5ce3abc43100005a007427c7');
      } else if (params.term === 'Iraq') {
        response = await axios.get('http://www.mocky.io/v2/5cedb031320000165e0c13bf');
        kwicResp = await axios.get('http://www.mocky.io/v2/5cedb0b4320000165e0c13c0');
      } else if (params.term === 'Irak') {
        response = await axios.get('http://www.mocky.io/v2/5cedb27d3200005f000c13c5');
        kwicResp = await axios.get('http://www.mocky.io/v2/5cedb2b0320000182b0c13c7');
      }
      commit('updateRawResults', { term: params.term, result: response.data });
      commit('processTemporal', { term: params.term, result: response.data[6] });
      commit('processRegional', { term: params.term, result: response.data });
      commit('processDispersion', { term: params.term, result: response.data });
      commit('processNarrative', { term: params.term, result: response.data[0] });
      commit('processKWIC', { term: params.term, result: kwicResp.data });
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
