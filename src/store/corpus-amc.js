import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/',
  queryTerms: [],
  rawResults: [],
  chartElements: [
    {
      component: 'lineChart',
      class: 'col-md-6 vis-component',
      chartProp: 'absolute',
    },
    {
      component: 'lineChart',
      class: 'col-md-6 vis-component',
      chartProp: 'relative',
    },
  ],
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
        { key: 'left', label: 'Left', sortable: true, class: 'text-right' },
        { key: 'term', label: 'Term', sortable: true, class: 'text-center' },
        { key: 'right', label: 'Right', sortable: true, class: 'text-left' },
      ],
      height: 600,
    },
  },
};

export const mutations = {
  resetQueryTerms(state, payload) {
    state.queryTerms = payload;
    console.log(payload)
  },
  resetChartData(state, payload) {
    state.chartData = payload;
    console.log(payload)
  },
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
    const items = payload.result;
    const absolute = { name: payload.term, data: [] };
    const relative = { name: payload.term, data: [] };
    for (let i = 0; i < items.length; i += 1) {
      absolute.data.push([Number(items[i].Word[0].n), items[i].freq]);
      relative.data.push([Number(items[i].Word[0].n), items[i].rel]);
    }
    // Sort by year
    absolute.data.sort((a, b) => a[0] - b[0]);
    relative.data.sort((a, b) => a[0] - b[0]);
    state.chartData.absolute.data.push(absolute);
    state.chartData.relative.data.push(relative);
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
    const countries = state.chartData.regional.countries;
    const itemsCountries = payload.result[1].data;
    for (let i = 0; i < itemsCountries.length; i += 1) {
      const categoriesKey = Object.keys(countries.categories).find(key => countries.categories[key] === itemsCountries[i][0]);
      series1D.data[categoriesKey] = itemsCountries[i][1];
      series2D.data[categoriesKey] = [itemsCountries[i][1], itemsCountries[i][2]];
    }
    state.chartData.regional.countries.series1D.push(series1D);
    state.chartData.regional.countries.series2D.push(series2D);

    /* Update Linguistic Regions Data */
    const regions = state.chartData.regional.regions;
    regions.categoriesY.push(payload.term);
    const categoriesYKey = Object.keys(regions.categoriesY).find(key => regions.categoriesY[key] === payload.term);
    const itemsRegions = payload.result[7].data;
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i][0];
      const categoriesXKey = Object.keys(regions.categoriesX).find(key => regions.categoriesX[key] === regionName);
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
        { year: items[i].year, doc: items[i].doc, country: items[i].country, left: items[i].left, term: items[i].center, right: items[i].right }
      );
    }
  },
};

export const getters = {
  chartData: state => state.chartData,
  queryTerms: state => state.queryTerms,
  chartElements: state => state.chartElements,
};

export const actions = {
  async corpusQuery({ state, commit, dispatch }, queryTerm) {
    try {
      const response = await axios.get(`${state.engineAPI}freqtt?q=aword,[word="${queryTerm}"];corpname=amc3_demo;fttattr=doc.year;fttattr=doc.docsrc_name;fttattr=doc.region;fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`);
      commit('updateRawResults', { term: queryTerm, result: response.data });
      commit('processTemporal', { term: queryTerm, result: response.data.Blocks[0].Items });
    } catch (error) {
      console.log(error);
    }
  },
  async corpusQueryData({ state, commit, dispatch }, params) {
    try {

      // commit('processRegional', { term: params.term, result: response.data });
      // commit('processDispersion', { term: params.term, result: response.data });
      // commit('processNarrative', { term: params.term, result: response.data[0] });
      // commit('processKWIC', { term: params.term, result: kwicResp.data });
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
