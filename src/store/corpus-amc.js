import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'https://noske-corpsum.acdh-dev.oeaw.ac.at/run.cgi/',
  corpusName: 'amc3_demo', // amc3_demo, amc_50M, amc_60M
  queryTerms: [],
  rawResults: [],
  modalTextContent: '',
  chartElements: [
    {
      component: 'visSeparator',
      class: 'col-md-12 vis-separator',
      chartProp: 'separatorQuery',
    },
    {
      component: 'barChart',
      class: 'col-md-6 vis-component',
      chartProp: 'querySummary',
    },
    {
      component: 'visSeparator',
      class: 'col-md-12 vis-separator',
      chartProp: 'separatorYearly',
    },
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
    {
      component: 'kwicTable',
      class: 'col-md-12 vis-component',
      chartProp: 'kwic',
    },
    {
      component: 'scatterChart',
      class: 'col-md-6 vis-component',
      chartProp: 'sources',
    },
    {
      component: 'heatmapChart',
      class: 'col-md-6 vis-component',
      chartProp: 'regions',
    },
  ],
  chartData: {
    separatorQuery: {
      title: 'Query Summary',
    },
    separatorYearly: {
      title: 'Diachronic Analysis',
    },
    querySummary: {
      title: 'Total Absolute Frequency',
      subtitle: 'Total absolute number of occurences (hits) of a given query',
      yAxisText: 'Number of Hits',
      xAxisType: 'category',
      series: [{ name: 'Absolute Frequency', data: [], colorByPoint: true }],
    },
    absolute: {
      title: 'Yearly Absolute Frequency',
      subtitle: 'Absolute number of occurences (hits) of a given query in years',
      yAxisText: 'Number of Hits',
      data: [],
    },
    relative: {
      title: 'Yearly Relative Frequency (%)',
      subtitle: 'Relative comparison to the baseline (100%) for the query in years',
      yAxisText: 'Relative Frequency (%)',
      data: [],
      plotLinesY: [{
        color: 'red',
        dashStyle: 'dot',
        width: 2,
        value: 100,
        label: {
          rotation: 0,
          x: 0,
          style: {
            fontStyle: 'italic',
            fontSize: '10',
          },
          text: 'Baseline (100%)',
        },
        zIndex: 3,
      }],
    },
    sources: {
      title: 'Sources',
      yAxisText: 'Absolute Frequency',
      xAxisText: 'Relative Frequency (%)',
      plotLinesX: [{
        color: 'red',
        dashStyle: 'dot',
        width: 2,
        value: 100,
        label: {
          rotation: 0,
          y: -5,
          style: {
            fontStyle: 'italic',
            fontSize: '10',
          },
          textAlign: 'center',
          text: 'Baseline (100%)',
        },
        zIndex: 3,
      }],
      series: [],
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
        'agesamt',
        'asuedost',
        'awest',
        'amitte',
        'aost',
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
        { key: 'actions', label: 'View', sortable: false, thStyle: { width: '45px' }, class: 'text-center' },
        { key: 'selected', label: 'All', sortable: false, thStyle: { width: '50px' }, class: 'text-center' },
        { key: 'date', label: 'Date', sortable: true, thStyle: { width: '100px' } },
        { key: 'source', label: 'Source', sortable: true, thStyle: { width: '250px' } },
        { key: 'region', label: 'Region', sortable: true, thStyle: { width: '80px' } },
        { key: 'left', label: 'Left', sortable: true, class: 'text-right' },
        { key: 'word', label: 'Word', sortable: true, class: 'text-center' },
        { key: 'right', label: 'Right', sortable: true, class: 'text-left' },
      ],
      height: 600,
    },
  },
};

// initial state
const defaultState = JSON.parse(JSON.stringify(state));

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
    for (let i = state.queryTerms.length - 1; i >= 0; i--) {
      if (state.queryTerms[i].text === queryTerm.text) {
        state.queryTerms.splice(i, 1);
        state.chartData.absolute.data.splice(i, 1);
        state.chartData.relative.data.splice(i, 1);
        state.chartData.sources.series.splice(i, 1);
        for (let j = state.chartData.kwic.items.length - 1; j >= 0; j--) {
          if (state.chartData.kwic.items[j].queryTerm === queryTerm.text) {
            state.chartData.kwic.items.splice(j, 1);
          }
        }
        break;
      }
    }
  },
  processSum(state, payload) {
    state.chartData.querySummary.series[0].data.push({ name: payload.term, y: payload.result });
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
  processSources(state, payload) {
    const items = payload.result;
    const series = { name: payload.term, symbol: 'circle', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      series.data.push({ x: items[i].rel, y: items[i].freq, source: items[i].Word[0].n });
    }
    state.chartData.sources.series.push(series);
  },
  processRegional(state, payload) {
    const regions = state.chartData.regions;
    regions.categoriesY.push(payload.term);
    const categoriesYKey = Object.keys(regions.categoriesY).find(key => regions.categoriesY[key] === payload.term);
    const itemsRegions = payload.result;
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i].Word[0].n;
      const categoriesXKey = Object.keys(regions.categoriesX).find(key => regions.categoriesX[key] === regionName);
      if (categoriesXKey) {
        regions.data.push([Number(categoriesXKey), Number(categoriesYKey), Math.round(itemsRegions[i].rel)]);
      }
    }

    /* Update Countries Data */
/*     const series1D = {
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
    state.chartData.regional.countries.series2D.push(series2D); */

    /* Update Linguistic Regions Data */
/*     const regions = state.chartData.regional.regions;
    regions.categoriesY.push(payload.term);
    const categoriesYKey = Object.keys(regions.categoriesY).find(key => regions.categoriesY[key] === payload.term);
    const itemsRegions = payload.result[7].data;
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i][0];
      const categoriesXKey = Object.keys(regions.categoriesX).find(key => regions.categoriesX[key] === regionName);
      if (categoriesXKey) {
        regions.data.push([Number(categoriesXKey), Number(categoriesYKey), Math.round(itemsRegions[i][1])]);
      }
    } */
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
    const items = payload.result.Lines;
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.kwic.items.push(
        {
          date: items[i].Tbl_refs[1],
          source: items[i].Tbl_refs[4],
          region: items[i].Tbl_refs[2],
          left: typeof items[i].Left[0] !== 'undefined' ? items[i].Left[0].str : '',
          word: typeof items[i].Kwic[0] !== 'undefined' ? items[i].Kwic[0].str : '',
          right: typeof items[i].Right[0] !== 'undefined' ? items[i].Right[0].str : '',
          docid: items[i].Tbl_refs[0],
          topic: items[i].Tbl_refs[3],
          toknum: items[i].toknum,
          selected: false,
          queryTerm: payload.term,
        },
      );
    }
    // Use overall rel. freq. data for other charts
    // const overallRel = payload.result.Desc[0].rel;
  },
  updateModalTextContent(state, payload) {
    const items = payload.result.content;
    let content = '';
    for (let i = 0; i < items.length; i += 1) {
      content += items[i].str;
    }
    state.modalTextContent = content;
  },
  changeSelectedCorpus(state, payload) {
    state.corpusName = payload;
  },
  resetState(state, payload) {
    // console.log(state.queryTerms)
    // console.log(defaultState.queryTerms)
    // state = JSON.parse(JSON.stringify(defaultState));
    state.queryTerms.push(payload);
  },
};

export const getters = {
  chartData: state => state.chartData,
  queryTerms: state => state.queryTerms,
  chartElements: state => state.chartElements,
  modalTextContent: state => state.modalTextContent,
  corpusName: state => state.corpusName,
};

export const actions = {
  async corpusQuery({ state, commit, dispatch }, queryTerm) {
    try {
      const response = await axios.get(`${state.engineAPI}freqtt?q=aword,[word="${queryTerm}"];corpname=${state.corpusName};fttattr=doc.year;fttattr=doc.region;fttattr=doc.docsrc_name;fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`);

      const kwicResp = await axios.get(`${state.engineAPI}viewattrsx?q=aword,[word="${queryTerm}"]&corpname=${state.corpusName}&viewmode=kwic&attrs=word&ctxattrs=word&setattrs=word&allpos=kw&setrefs==doc.id&setrefs==doc.datum&setrefs==doc.region&setrefs==doc.ressort2&setrefs==doc.docsrc_name&pagesize=1000&newctxsize=30&format=json`);

      commit('updateRawResults', { term: queryTerm, result: response.data });
      commit('processSum', { term: queryTerm, result: response.data.fullsize });
      commit('processTemporal', { term: queryTerm, result: response.data.Blocks[0].Items });
      commit('processSources', { term: queryTerm, result: response.data.Blocks[2].Items });
      commit('processRegional', { term: queryTerm, result: response.data.Blocks[1].Items });
      commit('processKWIC', { term: queryTerm, result: kwicResp.data });
    } catch (error) {
      console.log(error);
    }
  },
  async modalTextQuery({ state, commit, dispatch }, toknum) {
    try {
      const response = await axios.get(`${state.engineAPI}structctx?corpname=${state.corpusName};pos=${toknum};struct=doc&format=json`);
      commit('updateModalTextContent', { result: response.data });
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
