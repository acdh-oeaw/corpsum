import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

export const state = {
  engineAPI: 'https://noske-corpsum.acdh-dev.oeaw.ac.at/run.cgi/',
  corpusName: 'amc3_demo', // amc3_demo, amc_50M, amc_60M, amc_3.1
  rawResults: [],
  modalTextContent: '',
  loadingStatus: false,
  toggleIntroSection: true,
  toggleVisSection: false,
  chartElements: [
    {
      component: 'barChart',
      class: 'col-md-4 vis-component',
      chartProp: 'querySummary',
    },
    {
      component: 'lineChart',
      class: 'col-md-4 vis-component',
      chartProp: 'absolute',
    },
    {
      component: 'lineChart',
      class: 'col-md-4 vis-component',
      chartProp: 'relative',
    },
    {
      component: 'multiMap',
      class: 'col-md-6 vis-component',
      chartProp: 'regions',
    },
    {
      component: 'barChart',
      class: 'col-md-6 vis-component',
      chartProp: 'regions',
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
      component: 'scatterChart',
      class: 'col-md-6 vis-component',
      chartProp: 'sections',
    },
    {
      component: 'multiWordcloud',
      class: 'container-fluid p-0 d-flex',
      chartProp: 'collocations',
    },
  ],
  chartData: {
    queryTerms: [],
    separatorQuery: {
      title: 'Query Summary',
    },
    separatorYearly: {
      title: 'Diachronic Analysis',
    },
    separatorKWIC: {
      title: 'Keyword in Context (KWIC)',
    },
    separatorRegional: {
      title: 'Regional Analysis',
    },
    separatorDiscourse: {
      title: 'Discourse Analysis',
    },
    querySummary: {
      title: 'Total Frequency',
      subtitle: 'Total absolute number of occurences (hits) of a given query',
      yAxisText: 'Number of Hits',
      xAxisType: 'category',
      legendEnabled: false,
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
    sections: {
      title: 'Newspaper Sections',
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
    collocations: {
      clouds: [],
    },
    regions: {
      title: 'Total Absolute Frequency',
      subtitle: 'Total absolute number of occurences (hits) of a given query',
      yAxisText: 'Number of Hits',
      height: 480,
      legendEnabled: true,
      categoriesX: [
        'AT-Nationwide',
        'AT-Ost',
        'AT-Südost',
        'AT-Mitte',
        'AT-West',
        'Specific',
      ],
      series: [],
      maps: [],
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
        { key: 'word', label: 'Word', sortable: true, class: 'text-center kwic-word' },
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
    state.chartData.queryTerms = payload;
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
    state.chartData.queryTerms.push(queryTerm);
  },
  queryTermRemoved(state, queryTerm) {
    for (let i = state.chartData.queryTerms.length - 1; i >= 0; i--) {
      if (state.chartData.queryTerms[i].text === queryTerm.text) {
        state.chartData.queryTerms.splice(i, 1);
        state.chartData.querySummary.series[0].data.splice(i, 1);
        state.chartData.absolute.data.splice(i, 1);
        state.chartData.relative.data.splice(i, 1);
        state.chartData.regions.maps.splice(i, 1);
        state.chartData.regions.series.splice(i, 1);
        state.chartData.sources.series.splice(i, 1);
        state.chartData.sections.series.splice(i, 1);
        state.chartData.collocations.clouds.splice(i, 1);
        for (let j = state.chartData.kwic.items.length - 1; j >= 0; j--) {
          if (state.chartData.kwic.items[j].queryTerm === queryTerm.text) {
            state.chartData.kwic.items.splice(j, 1);
          }
        }
        break;
      }
    }
    if (state.chartData.queryTerms.length === 0) {
      state.toggleIntroSection = true;
      state.toggleVisSection = false;
    }
  },
  changeLoadingStatus(state, payload) {
    state.loadingStatus = payload.status;
    if (payload.status === false) {
      state.toggleIntroSection = false;
      state.toggleVisSection = true;
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
  processSections(state, payload) {
    const items = payload.result;
    const series = { name: payload.term, symbol: 'circle', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      series.data.push({ x: items[i].rel, y: items[i].freq, source: items[i].Word[0].n });
    }
    state.chartData.sections.series.push(series);
  },
  processCollocations(state, payload) {
    const items = payload.result.Items;
    const data = [];
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].str.length > 1) {
        data.push({ name: items[i].str, weight: items[i].Stats[0].s });
      }
    }
    state.chartData.collocations.clouds.push({ cloudData: { data, title: `Collocations Wordcloud: ${payload.term}`, subtitle: 'Content' } });
  },
  processRegional(state, payload) {
    const itemsRegions = payload.result;
    const map = {
      mapData: {
        title: 'Regional Relative Frequency (%)',
        queryTerm: payload.term,
        data: [],
      },
    };
    const seriesData = {
      name: payload.term,
      data: [0, 0, 0, 0, 0, 0],
    };
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i].Word[0].n;
      let regionPrettyName;
      switch (regionName) {
        case 'aost':
          regionPrettyName = 'AT-Ost';
          seriesData.data[1] = itemsRegions[i].freq;
          break;
        case 'asuedost':
          regionPrettyName = 'AT-Südost';
          seriesData.data[2] = itemsRegions[i].freq;
          break;
        case 'amitte':
          regionPrettyName = 'AT-Mitte';
          seriesData.data[3] = itemsRegions[i].freq;
          break;
        case 'awest':
          regionPrettyName = 'AT-West';
          seriesData.data[4] = itemsRegions[i].freq;
          break;
        case 'agesamt':
          regionPrettyName = 'AT-Nationwide';
          seriesData.data[0] = itemsRegions[i].freq;
          break;
        case 'spezifisch':
          regionPrettyName = 'Specific';
          seriesData.data[5] = itemsRegions[i].freq;
          break;
        default:
          regionPrettyName = '';
      }
      map.mapData.data.push({ query: payload.term, name: regionPrettyName, value: itemsRegions[i].rel });
    }
    state.chartData.regions.maps.push(map);
    state.chartData.regions.series.push(seriesData);
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
    console.log(items);
    let content = '';
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].class === 'coll') {
        items[i].str = ` ${items[i].str} `;
      }
      content += items[i].str;
    }
    content = content.replace(payload.term.trim(), `<span class="kw-highlight">${payload.term.trim()}</span>`);
    state.modalTextContent = content;
  },
  changeSelectedCorpus(state, payload) {
    state.corpusName = payload;
  },
  resetState(state, payload) {
    // console.log(state.queryTerms)
    // console.log(defaultState.queryTerms)
    // state = JSON.parse(JSON.stringify(defaultState));
    state.chartData.queryTerms.push(payload);
  },
};

export const getters = {
  chartData: state => state.chartData,
  queryTerms: state => state.chartData.queryTerms,
  chartElements: state => state.chartElements,
  modalTextContent: state => state.modalTextContent,
  corpusName: state => state.corpusName,
  loadingStatus: state => state.loadingStatus,
  toggleIntroSection: state => state.toggleIntroSection,
  toggleVisSection: state => state.toggleVisSection,
};

export const actions = {
  async corpusQuery({ state, commit, dispatch }, queryTerm) {
    try {
      /*
      const response = await axios.get(`${state.engineAPI}freqtt?q=aword,[word="${queryTerm}"];corpname=${state.corpusName};fttattr=doc.year;fttattr=doc.region;fttattr=doc.docsrc_name;fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`);
      */
      commit('changeLoadingStatus', { status: true });

      if (queryTerm.charAt(0) !== '[' && queryTerm.charAt(0) !== '(') {
        queryTerm = `[word="${queryTerm}"]`;
      }
      const queryTermEncoded = encodeURIComponent(`aword,${queryTerm}`);
      const response = await axios.get(`${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.corpusName};fttattr=doc.year;fttattr=doc.region;fttattr=doc.docsrc_name;fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`);

      const kwicResp = await axios.get(`${state.engineAPI}viewattrsx?q=${queryTermEncoded}&corpname=${state.corpusName}&viewmode=kwic&attrs=word&ctxattrs=word&setattrs=word&allpos=kw&setrefs==doc.id&setrefs==doc.datum&setrefs==doc.region&setrefs==doc.ressort2&setrefs==doc.docsrc_name&pagesize=1000&newctxsize=30&format=json`);

      const collxResp = await axios.get(`${state.engineAPI}collx?q=${queryTermEncoded};corpname=${state.corpusName};cfromw=-5;ctow=5;cminfreq=5;cminbgr=3;cmaxitems=50;cbgrfns=d;csortfn=d;format=json`);

      commit('changeLoadingStatus', { status: false });
      commit('processSum', { term: queryTerm, result: response.data.fullsize });
      commit('processTemporal', { term: queryTerm, result: response.data.Blocks[0].Items });
      commit('processRegional', { term: queryTerm, result: response.data.Blocks[1].Items });
      commit('processKWIC', { term: queryTerm, result: kwicResp.data });
      commit('processSources', { term: queryTerm, result: response.data.Blocks[2].Items });
      commit('processSections', { term: queryTerm, result: response.data.Blocks[3].Items });
      commit('processCollocations', { term: queryTerm, result: collxResp.data });
      commit('updateRawResults', { term: queryTerm, result: response.data });
    } catch (error) {
      console.log(error);
    }
  },
  async modalTextQuery({ state, commit, dispatch }, item) {
    try {
      const response = await axios.get(`${state.engineAPI}structctx?corpname=${state.corpusName};pos=${item.toknum};struct=doc&format=json`);
      commit('updateModalTextContent', { term: item.word, result: response.data });
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
