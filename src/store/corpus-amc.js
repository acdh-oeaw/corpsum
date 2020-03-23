import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';

// Axios properties
Vue.prototype.$http = axios;
Vue.prototype.axios = axios;

Vue.use(Vuex);

function getObjectKey(object, value, property) {
  if (property) return Object.keys(object).find((key) => object[key][property] === value);
  return Object.keys(object).find((key) => object[key] === value);
}

const mutations = {
  resetQueryTerms(state, payload) {
    state.chartData.queryTerms = payload;
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
    state.chartData.queryTerms.push(queryTerm);
  },
  queryTermRemoved(state, queryTerm) {
    for (let i = state.chartData.queryTerms.length - 1; i >= 0; i -= 1) {
      if (state.chartData.queryTerms[i].text === queryTerm.text) {
        state.chartData.queryTerms.splice(i, 1);
        state.chartData.querySummary.series[0].data.splice(i, 1);
        state.chartData.queryRelSummary.series[0].data.splice(i, 1);
        state.chartData.wordTree.charts.splice(i, 1);
        state.chartData.temporal.absolute.data.splice(i, 1);
        state.chartData.temporal.relative.data.splice(i, 1);
        state.chartData.regions.relativeMaps.splice(i, 1);
        state.chartData.regions.absoluteMaps.splice(i, 1);
        //state.chartData.regions.series.splice(i, 1);
        state.chartData.sources.series.splice(i, 1);
        state.chartData.sections.series.splice(i, 1);
        state.chartData.collocations.clouds.splice(i, 1);
        for (let k = state.chartData.wordFreqSummary.data.length - 1; k >= 0; k -= 1) {
          if (state.chartData.wordFreqSummary.data[k].parent === queryTerm.text || state.chartData.wordFreqSummary.data[k].id === queryTerm.text) {
            state.chartData.wordFreqSummary.data.splice(k, 1);
          }
        }
        for (let j = state.chartData.kwic.items.length - 1; j >= 0; j -= 1) {
          if (state.chartData.kwic.items[j].queryTerm === queryTerm.text) {
            state.chartData.kwic.items.splice(j, 1);
          }
        }
        for (let l = state.chartData.queryRelSummary.series[0].wordForms.length - 1; l >= 0; l -= 1) {
          if (state.chartData.queryRelSummary.series[0].wordForms[l].query === queryTerm.text) {
            state.chartData.queryRelSummary.series[0].wordForms.splice(l, 1);
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
  /*
  reorderQueryTermsList(state) {
    const items = state.chartData.querySummary.series[0].data;
    state.chartData.queryTerms = [];
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.queryTerms.push({ text: items[i].name, tiClasses: ['ti-valid'] });
    }
  }, */
  changeLoadingStatus(state, payload) {
    state.loadingStatus = payload.status;
    if (payload.status === false && payload.type !== 'intro') {
      state.toggleIntroSection = false;
      state.toggleVisSection = true;
    }
  },
  /*
  processSum(state, payload) {
    state.chartData.querySummary.series[0].data.push({ name: payload.term, y: payload.result });
  }, */
  processWordFreqSum(state, payload) {
    // processSum
    state.chartData.querySummary.series[0].data.push({ name: payload.term, y: payload.processSumResp });
    // reorderQueryTermsList
    let items = state.chartData.querySummary.series[0].data;
    state.chartData.queryTerms = [];
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.queryTerms.push({ text: items[i].name, tiClasses: ['ti-valid'] });
    }
    // processWordFreqSum
    const colors = ['#4e79a7', '#edc948', '#e15759', '#76b7b2', '#f28e2b', '#ff9da7', '#FF9655', '#FFF263', '#6AF9C4'];
    let queryTermKey;
    for (let i = 0; i < state.chartData.queryTerms.length; i += 1) {
      if (state.chartData.queryTerms[i].text === payload.term) {
        queryTermKey = i;
        break;
      }
    }
    items = payload.result.Blocks[0].Items;



    const termArrayKey = getObjectKey(state.chartData.queryRelSummary.series[0].data, payload.term, 'name');

    //state.chartData.queryRelSummary.series[0].data[termArrayKey].absTotal = payload.processSumResp;

    const corpusTokenSize = parseInt(state.infoData.corpInfoTable.items[4].count.split('.').join(''), 10);

    for (let i = 0; i < items.length && i < 25; i += 1) {
      const relValue = (items[i].freq * 1000000) / corpusTokenSize;
      state.chartData.queryRelSummary.series[0].wordForms.push({
        query: payload.term,
        name: items[i].Word[0].n,
        absValue: items[i].freq,
        relValue: Math.round((relValue + Number.EPSILON) * 100) / 100,
      });
    }

    state.chartData.wordFreqSummary.data.push({
      id: payload.term,
      name: payload.term,
      color: colors[queryTermKey],
      sortIndex: queryTermKey,
    });
    for (let i = 0; i < items.length; i += 1) {
      state.chartData.wordFreqSummary.data.push({
        name: items[i].Word[0].n,
        parent: payload.term,
        value: items[i].freq,
      });
    }
  },


  processMetaFreq(state, payload) {
    const metaAttr = payload;
    const metaVal = payload.metaVal;
    const queryTerm = payload.term;
    const absFreq = payload.absFreq;
    const relFreq = payload.relFreq;
    const storeObject = payload.storeObject;

    const absDataKey = getObjectKey(storeObject.absolute.data, queryTerm, 'name');
    const relDataKey = getObjectKey(storeObject.relative.data, queryTerm, 'name');

    const yearKey = getObjectKey(state.infoData.docsYears.data[0].data, Number(metaVal), [0]);
    if (state.infoData.docsYears.data[0].data[yearKey]) {
      const yearTokenSize = state.infoData.docsYears.data[0].data[yearKey][1];

      const relNormValue = (absFreq * 1000000) / yearTokenSize;

      const absData = { year: Number(metaVal), value: absFreq };
      const relData = { year: Number(metaVal), value: Math.round((relNormValue + Number.EPSILON) * 100) / 100 };

      if (absDataKey) {
        // Avoid duplicating the same data
        if (!getObjectKey(storeObject.absolute.data[absDataKey].data, absData.year, 'year')) {
          storeObject.absolute.data[absDataKey].data.push(absData);
          // Sort by year
          storeObject.absolute.data[absDataKey].data.sort((a, b) => a.year - b.year);
        }
      } else {
        storeObject.absolute.data.push({ name: queryTerm, data: [absData] });
      }

      if (relDataKey) {
        // Avoid duplicating the same data
        if (!getObjectKey(storeObject.relative.data[relDataKey].data, relData.year, 'year')) {
          storeObject.relative.data[relDataKey].data.push(relData);
          // Sort by year
          storeObject.relative.data[relDataKey].data.sort((a, b) => a.year - b.year);
        }
      } else {
        storeObject.relative.data.push({ name: queryTerm, data: [relData] });
      }
    }
  },


  processTemporal(state, payload) {
    const items = payload.result;
    const absolute = { name: payload.term, data: [] };
    const relative = { name: payload.term, data: [] };
    //const skeRelative = { name: payload.term, data: [] };

    const corpusTokenSize = parseInt(state.infoData.corpInfoTable.items[4].count.split('.').join(''), 10);

    for (let i = 0; i < items.length; i += 1) {
      const yearKey = getObjectKey(state.infoData.docsYears.data[0].data, Number(items[i].Word[0].n), [0]);
      const yearTokenSize = state.infoData.docsYears.data[0].data[yearKey][1];
      const relValue = (items[i].freq * 1000000) / yearTokenSize;
      absolute.data.push([Number(items[i].Word[0].n), items[i].freq]);
      relative.data.push([Number(items[i].Word[0].n),  Math.round((relValue + Number.EPSILON) * 100) / 100]);
      //skeRelative.data.push([Number(items[i].Word[0].n), items[i].rel]);
    }
    // Sort by year
    absolute.data.sort((a, b) => a[0] - b[0]);
    relative.data.sort((a, b) => a[0] - b[0]);
    //skeRelative.data.sort((a, b) => a[0] - b[0]);
    state.chartData.temporal.absolute.data.push(absolute);
    state.chartData.temporal.relative.data.push(relative);
    //state.chartData.temporal.skeRelative.data.push(skeRelative);
  },
  processSources(state, payload) {
    const items = payload.result;
    const docsrcSizeItems = payload.docsrcSize.Items;
    const series = { name: payload.term, symbol: 'circle', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      for (let j = 0; j < docsrcSizeItems.length; j += 1) {
        if (docsrcSizeItems[j].str === items[i].Word[0].n) {
          series.data.push({
            x: items[i].rel, y: items[i].freq, z: docsrcSizeItems[j].freq, source: items[i].Word[0].n,
          });
          break;
        }
      }
    }
    state.chartData.sources.series.push(series);
  },
  processSections(state, payload) {
    const items = payload.result;
    const ressortSizeItems = payload.ressortSize.Items;
    const series = { name: payload.term, symbol: 'circle', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      for (let j = 0; j < ressortSizeItems.length; j += 1) {
        if (ressortSizeItems[j].str === items[i].Word[0].n) {
          series.data.push({
            x: items[i].rel, y: items[i].freq, z: ressortSizeItems[j].freq, source: items[i].Word[0].n,
          });
          break;
        }
      }
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
    state.chartData.collocations.clouds.push({ cloudData: { data, title: `Collocations Wordcloud: ${payload.term}`, subtitle: 'This word cloud displays the highest ranking collocations of this query sorted by the logDice score.' } });
  },
  processRegional(state, payload) {
    const itemsRegions = payload.result;
    const relativeMap = {
      mapData: {
        title: 'Regional Relative Frequency (%)',
        queryTerm: payload.term,
        valueTypeLabel: 'Relevative Frequency (%)',
        valueTypeUnit: '%',
        data: [],
      },
    };
    const absoluteMap = {
      mapData: {
        title: 'Regional Absolute Frequency',
        queryTerm: payload.term,
        valueTypeLabel: 'Absolute Frequency (Hits)',
        valueTypeUnit: '',
        data: [],
      },
    };
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i].Word[0].n;
      let regionPrettyName;
      switch (regionName) {
        case 'aost':
          regionPrettyName = 'AT-Ost';
          break;
        case 'asuedost':
          regionPrettyName = 'AT-Südost';
          break;
        case 'amitte':
          regionPrettyName = 'AT-Mitte';
          break;
        case 'awest':
          regionPrettyName = 'AT-West';
          break;
        case 'agesamt':
          regionPrettyName = 'AT-Nationwide';
          break;
        case 'spezifisch':
          regionPrettyName = 'Specific';
          break;
        default:
          regionPrettyName = '';
      }
      if (regionName !== 'spezifisch') {
        relativeMap.mapData.data.push({ query: payload.term, name: regionPrettyName, value: itemsRegions[i].rel });
        absoluteMap.mapData.data.push({ query: payload.term, name: regionPrettyName, value: itemsRegions[i].freq });
      }
    }
    state.chartData.regions.relativeMaps.push(relativeMap);
    state.chartData.regions.absoluteMaps.push(absoluteMap);
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
  processCorpInfo(state, payload) {
    const items = payload.result.sizes;
    state.infoData.corpInfoTable.items.push(
      { unit: 'Documents', count: items.doccount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
      { unit: 'Paragraphs', count: items.parcount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
      { unit: 'Sentences', count: items.sentcount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
      { unit: 'Words', count: items.wordcount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
      { unit: 'Tokens', count: items.tokencount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
    );
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
    const overallRel = payload.result.Desc[0].rel;

    const corpusTokenSize = parseInt(state.infoData.corpInfoTable.items[4].count.split('.').join(''), 10);

    const absValue = (overallRel * corpusTokenSize) / 1000000;

    state.chartData.queryRelSummary.series[0].data.push({
      name: payload.term,
      relValue: overallRel,
      absValue: Math.round((absValue + Number.EPSILON) * 100) / 100,
    });
  },
  processWordTree(state, payload) {
    const chart = {
      chartData: {
        title: 'The Most Frequent Multilevel Combinations',
        subtitle: 'This chart displays the most frequent multilevel combinations for the given query. From the node in the center one level left and one level right combinations are queried.',
        data: [],
        nodes: [],
      },
    };
    const items = payload.result.Blocks[0].Items;
    let nodeID = 0;
    for (let i = 0; (i < items.length) && (chart.chartData.data.length < 20); i += 1) {
      if (items[i] && !items[i].Word[0].n.match(/[^A-zÀ-ú\s]/gi) && !items[i].Word[2].n.match(/[^A-zÀ-ú\s]/gi)) {
        chart.chartData.nodes.push({
          id: nodeID,
          name: items[i].Word[0].n,
          pos: 0,
        });
        const centerNodeID = getObjectKey(chart.chartData.nodes, items[i].Word[1].n, 'name') || nodeID + 1;
        chart.chartData.nodes.push({
          id: centerNodeID,
          name: items[i].Word[1].n,
          pos: 1,
        });
        chart.chartData.nodes.push({
          id: nodeID + 2,
          name: items[i].Word[2].n,
          pos: 2,
        });
        chart.chartData.data.push({
          from: nodeID,
          to: centerNodeID,
          weight: items[i].freq,
        });
        chart.chartData.data.push({
          from: centerNodeID,
          to: nodeID + 2,
          weight: items[i].freq,
        });
        nodeID += 3;
      }
    }
    state.chartData.wordTree.charts.push(chart);
  },
  updateModalTextContent(state, payload) {
    const items = payload.result.content;
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
  updateSubcorporaList(state, payload) {
    const items = payload.result;
    for (let i = 0; i < items.length; i += 1) {
      state.subcorporaList.push({ name: items[i].n, value: items[i].n, desc: `Query the subcorpus: ${items[i].n}` });
    }
  },
  changeSelectedCorpus(state, payload) {
    state.selectedCorpus = payload;
  },
  changeSelectedSubcorpus(state, payload) {
    state.selectedSubcorpus = payload;
  },
  resetState(state, payload) {
    // console.log(state.queryTerms)
    // console.log(defaultState.queryTerms)
    // state = JSON.parse(JSON.stringify(defaultState));
    state.chartData.queryTerms.push(payload);
  },
  processDocsYears(state, payload) {
    const items = payload.result.Items;
    const absolute = { name: 'Number of Documents', data: [] };
    for (let i = 0; i < items.length; i += 1) {
      absolute.data.push([Number(items[i].str), items[i].freq]);
    }
    // Sort by year
    absolute.data.sort((a, b) => a[0] - b[0]);
    state.infoData.docsYears.data.push(absolute);
  },
  processDocsRegions(state, payload) {
    const itemsRegions = payload.result.Items;
    const seriesData = {
      name: 'Documents',
      data: [0, 0, 0, 0, 0, 0],
    };
    for (let i = 0; i < itemsRegions.length; i += 1) {
      const regionName = itemsRegions[i].str;
      switch (regionName) {
        case 'aost':
          seriesData.data[1] = itemsRegions[i].freq;
          break;
        case 'asuedost':
          seriesData.data[2] = itemsRegions[i].freq;
          break;
        case 'amitte':
          seriesData.data[3] = itemsRegions[i].freq;
          break;
        case 'awest':
          seriesData.data[4] = itemsRegions[i].freq;
          break;
        case 'agesamt':
          seriesData.data[0] = itemsRegions[i].freq;
          break;
        case 'spezifisch':
          seriesData.data[5] = itemsRegions[i].freq;
          break;
        default:
      }
    }
    state.infoData.docsRegions.series.push(seriesData);
  },
  processDocsSources(state, payload) {
    const items = payload.result.Items;
    for (let i = 0; (i < items.length) && (i < 20); i += 1) {
      state.infoData.docsSources.data.push({
        id: items[i].str,
        name: items[i].str,
        value: items[i].freq,
        sortIndex: i,
      });
    }
  },
  processDocsRessorts(state, payload) {
    const items = payload.result.Items;
    for (let i = 0; (i < items.length) && (i < 20); i += 1) {
      state.infoData.docsRessorts.data.push({
        id: items[i].str,
        name: items[i].str,
        value: items[i].freq,
        sortIndex: i,
      });
    }
  },
  processTopLCs(state, payload) {
    const items = payload.result.Items;
    const zipfCurve = {
      type: 'line',
      name: "Zipf's curve",
      color: 'rgba(78, 121, 167, 0.5)',
      marker: false,
      data: [],
      visible: false,
    };
    const maxVal = items[0].freq;
    for (let i = 0; i < items.length; i += 1) {
      state.infoData.topLCs.series.push({
        name: items[i].str,
        color: 'rgba(78, 121, 167, 0.75)',
        data: [[i, items[i].freq]],
        showInLegend: false,
      });
      zipfCurve.data.push(maxVal / (i + 1));
    }
    state.infoData.topLCs.series.push(zipfCurve);
  },
  processTopLemmas(state, payload) {
    const items = payload.result.Items;
    const zipfCurve = {
      type: 'line',
      name: "Zipf's curve",
      color: 'rgba(78, 121, 167, 0.5)',
      marker: false,
      data: [],
      visible: false,
    };
    const maxVal = items[0].freq;
    for (let i = 0; i < items.length; i += 1) {
      state.infoData.topLemmas.series.push({
        name: items[i].str,
        color: 'rgba(78, 121, 167, 0.75)',
        data: [[i, items[i].freq]],
        showInLegend: false,
      });
      zipfCurve.data.push(maxVal / (i + 1));
    }
    state.infoData.topLemmas.series.push(zipfCurve);
  },
};

const getters = {
  chartData: (state) => state.chartData,
  queryTerms: (state) => state.chartData.queryTerms,
  chartElements: (state) => state.chartElements,
  modalTextContent: (state) => state.modalTextContent,
  selectedSubcorpus: (state) => state.selectedSubcorpus,
  selectedCorpus: (state) => state.selectedCorpus,
  subcorporaList: (state) => state.subcorporaList,
  corporaList: (state) => state.corporaList,
  loadingStatus: (state) => state.loadingStatus,
  toggleIntroSection: (state) => state.toggleIntroSection,
  toggleVisSection: (state) => state.toggleVisSection,
  infoData: (state) => state.infoData,
  infoElements: (state) => state.infoElements,
};

const actions = {
  async corpusQuery({ state, commit, dispatch }, queryTerm) {
    try {
      commit('changeLoadingStatus', { status: true });

      if (router.currentRoute.params.corpus) {
        const corpusKey = getObjectKey(state.corporaList, router.currentRoute.params.corpus, 'value');
        state.selectedcorpus = state.corporaList[corpusKey];
      }
      if (router.currentRoute.params.subcorpus) {
        const subcorpusKey = getObjectKey(state.subcorporaList, router.currentRoute.params.subcorpus, 'value');
        state.selectedSubcorpus = state.subcorporaList[subcorpusKey];
      }
      if (router.currentRoute.params.query) {
        queryTerm = router.currentRoute.params.query;
        state.chartData.queryTerms = [];
        commit('queryTermAdded', {"text": queryTerm, "tiClasses":["ti-valid"]});
      }

      const queryTermEncoded = encodeURIComponent(`aword,${queryTerm}`);
      // const requestURIs = {};
      let useSubCorp = '';
      if (state.selectedSubcorpus.value !== 'none') {
        useSubCorp = `usesubcorp=${state.selectedSubcorpus.value};`;
      }

      /*
      requestURIs.freqttURI = `${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.corpusName};${useSubCorp}fttattr=doc.year;fttattr=doc.region;fttattr=doc.docsrc_name;fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`;
      requestURIs.freqmlURI = `${state.engineAPI}freqml?q=${queryTermEncoded};corpname=${state.corpusName};${useSubCorp}attrs=word;ctxattrs=word;pagesize=1000;gdexcnt=0;ml=1;flimit=0;ml1attr=word;ml1ctx=-1<0;ml2attr=word;ml2ctx=0~0>0;freqlevel=3;ml3attr=word;ml3ctx=1>0;format=json`;
      requestURIs.collxURI = `${state.engineAPI}collx?q=${queryTermEncoded};corpname=${state.corpusName};${useSubCorp}cfromw=-5;ctow=5;cminfreq=5;cminbgr=3;cmaxitems=50;cbgrfns=d;csortfn=d;format=json`;
      const responses = {};
      */

      dispatch('requestKWIC', { queryTerm, queryTermEncoded, useSubCorp });
      dispatch('requestWordForms', { queryTerm, queryTermEncoded, useSubCorp });
      //dispatch('requestTemporal', { queryTerm, queryTermEncoded, useSubCorp });

      const metaAttr = 'year';
      for (let i = 1990; i < 2019; i += 1) {
        const metaVal = i;
        dispatch('requestMetaFreq', { queryTerm, metaAttr, metaVal, useSubCorp, storeObject: state.chartData.temporal });
      }

      //dispatch('requestRegional', { queryTerm, queryTermEncoded, useSubCorp });
      //dispatch('requestMediaSources', { queryTerm, queryTermEncoded, useSubCorp });
      //dispatch('requestSections', { queryTerm, queryTermEncoded, useSubCorp });
      commit('changeLoadingStatus', { status: false });

      //commit('processSum', { term: queryTerm, result: response.data.fullsize });
      //commit('processWordTree', { term: queryTerm, result: responses.freqmlURI.data });
      //commit('processCollocations', { term: queryTerm, result: responses.collxURI.data });
      //commit('updateRawResults', { term: queryTerm, result: responses.freqttURI.data });
    } catch (error) {
      console.log(error);
    }
  },
  // API request used for total rel. freq. and KWIC results
  async requestKWIC({ state, commit, dispatch }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const viewattrsxURI = `${state.engineAPI}viewattrsx?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}viewmode=kwic;attrs=word;ctxattrs=word;setattrs=word;allpos=kw;setrefs==doc.id;setrefs==doc.datum;setrefs==doc.region;setrefs==doc.ressort2;setrefs==doc.docsrc_name;pagesize=1000;newctxsize=30;async=0;format=json`;
      const response = await axios.get(viewattrsxURI);
      commit('processKWIC', { term: queryTerm, result: response.data });
    } catch (error) {
      console.log(error);
    }
  },



  // API request used for metal rel. freq. and abs. freq. results
  async requestMetaFreq({ state, commit, dispatch }, { queryTerm, metaAttr, metaVal, useSubCorp, storeObject }) {
    try {
      const queryTermEncoded = encodeURIComponent(`aword,${queryTerm} within <doc ${metaAttr}="${metaVal}"/>`);
      const viewattrsxURI = `${state.engineAPI}viewattrsx?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}viewmode=kwic;attrs=word;ctxattrs=word;setattrs=word;allpos=kw;pagesize=10;newctxsize=20;async=0;format=json`;
      const response = await axios.get(viewattrsxURI);
      const absFreq = response.data.Desc[0].size;
      const relFreq = response.data.Desc[0].rel;
      commit('processMetaFreq', { metaAttr, metaVal, term: queryTerm, absFreq, relFreq, storeObject });
    } catch (error) {
      console.log(error);
    }
  },

  

  // API request used for word form freq. results
  async requestWordForms({ state, commit, dispatch }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const freqsURI = `${state.engineAPI}freqs?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}fcrit=word/e 0~0>0;flimit=0;format=json`;
      const response = await axios.get(freqsURI);
      commit('processWordFreqSum', { term: queryTerm, result: response.data });

      //const wordFormSetIndex = state.chartData.temporal.wordForms.push({ name: queryTerm, data: [] }) - 1;
      // const wordFormSet = state.chartData.temporal.wordForms[wordFormSetIndex];
      const items = response.data.Blocks[0].Items;
      for (let i = 0; i < items.length && i < 16; i += 1) {
        const metaAttr = 'year';
        const wordFormQueryTerm = `[word="${items[i].Word[0].n}"]`;
        // wordFormSet.data.push({ absolute: { data: [] }, relative: { data: [] } });
        for (let j = 1990; j < 2019; j += 1) {
          const metaVal = j;
          dispatch('requestMetaFreq', { queryTerm: wordFormQueryTerm, metaAttr, metaVal, useSubCorp, storeObject: state.chartData.temporal.wordForms });
        }
      }

    } catch (error) {
      console.log(error);
    }
  },
  // API request used for temporal freq. results
  async requestTemporal({ state, commit }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const freqttURI = `${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}fttattr=doc.year;fcrit=doc.id;flimit=0;format=json`;
      const response = await axios.get(freqttURI);
      commit('processTemporal', { term: queryTerm, result: response.data.Blocks[0].Items });
    } catch (error) {
      console.log(error);
    }
  },
  // API request used for regional freq. results
  async requestRegional({ state, commit }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const freqttURI = `${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}fttattr=doc.region;fcrit=doc.id;flimit=0;format=json`;
      const response = await axios.get(freqttURI);
      commit('processRegional', { term: queryTerm, result: response.data.Blocks[0].Items });
    } catch (error) {
      console.log(error);
    }
  },
  // API request used for media sources freq. results
  async requestMediaSources({ state, commit }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const freqttURI = `${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}fttattr=doc.docsrc_name;fcrit=doc.id;flimit=0;format=json`;
      const response = await axios.get(freqttURI);
      const wordlistDocsrcURI = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.docsrc_name;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
      const wordlistDocsrcResponse = await axios.get(wordlistDocsrcURI);
      commit('processSources', { term: queryTerm, result: response.data.Blocks[0].Items, docsrcSize: wordlistDocsrcResponse.data });
    } catch (error) {
      console.log(error);
    }
  },
  // API request used for ressorts freq. results
  async requestSections({ state, commit }, { queryTerm, queryTermEncoded, useSubCorp }) {
    try {
      const freqttURI = `${state.engineAPI}freqtt?q=${queryTermEncoded};corpname=${state.selectedCorpus.value};${useSubCorp}fttattr=doc.ressort2;fcrit=doc.id;flimit=0;format=json`;
      const response = await axios.get(freqttURI);
      const wordlistRessortURI = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.ressort2;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
      const wordlistRessortResponse = await axios.get(wordlistRessortURI);
      commit('processSections', { term: queryTerm, result: response.data.Blocks[0].Items, ressortSize: wordlistRessortResponse.data });
    } catch (error) {
      console.log(error);
    }
  },
  async modalTextQuery({ state, commit }, item) {
    try {
      if (router.currentRoute.params.corpus) {
        const corpusKey = getObjectKey(state.corporaList, router.currentRoute.params.corpus, 'value');
        state.selectedcorpus = state.corporaList[corpusKey];
      }
      const response = await axios.get(`${state.engineAPI}structctx?corpname=${state.selectedCorpus.value};pos=${item.toknum};struct=doc;format=json`);
      commit('updateModalTextContent', { term: item.word, result: response.data });
    } catch (error) {
      console.log(error);
    }
  },
  async createSubcorpus({ state, dispatch }, params) {
    try {
      const { docs, title } = params;

      let docsURIComp;
      for (let i = 0; i < docs.length; i += 1) {
        docsURIComp += `;sca_doc.id=${docs[i]}`;
      }
      await axios.get(`${state.engineAPINoCache}subcorp?corpname=${state.selectedCorpus.value};reload=;subcname=${title};create=True${docsURIComp}`);
      dispatch('getSubcorporaList');
    } catch (error) {
      console.log(error);
    }
  },
  async getSubcorporaList({ state, commit }) {
    try {
      const response = await axios.get(`${state.engineAPINoCache}corp_info?corpname=${state.selectedCorpus.value};subcorpora=1;format=json`);
      commit('updateSubcorporaList', { result: response.data.subcorpora });
    } catch (error) {
      console.log(error);
    }
  },
  async queryCorpusInfo({ state, commit, dispatch }) {
    try {
      commit('changeLoadingStatus', { status: true, type: 'intro' });
      if (router.currentRoute.params.corpus) {
        const corpusKey = getObjectKey(state.corporaList, router.currentRoute.params.corpus, 'value');
        state.selectedcorpus = state.corporaList[corpusKey];
      }
      const requestURIs = {};
      requestURIs.docsYears = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.year;wlminfreq=1;include_nonwords=1;wlsort=f;format=json`;
      requestURIs.docsRegions = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.region;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
      requestURIs.docsSources = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.docsrc_name;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
      requestURIs.docsRessorts = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=1000;wlattr=doc.ressort2;wlminfreq=1;include_nonwords=1;wlsort=f;wlnums=docf;format=json`;
      // requestURIs.topLCs = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=50;wlattr=lc;wlminfreq=5;wlsort=f;wlnums=frq;format=json`;
      requestURIs.corpInfo = `${state.engineAPI}corp_info?corpname=${state.selectedCorpus.value}&format=json`;
      requestURIs.topLemmas = `${state.engineAPI}wordlist?corpname=${state.selectedCorpus.value};wlmaxitems=50;wlattr=lemma;wlminfreq=5;wlsort=f;wlnums=frq;format=json`;

      const responses = {};
      responses.docsYears = await axios.get(requestURIs.docsYears);
      responses.docsRegions = await axios.get(requestURIs.docsRegions);
      responses.docsSources = await axios.get(requestURIs.docsSources);
      responses.docsRessorts = await axios.get(requestURIs.docsRessorts);
      // responses.topLCs = await axios.get(requestURIs.topLCs);
      responses.corpInfo = await axios.get(requestURIs.corpInfo);
      responses.topLemmas = await axios.get(requestURIs.topLemmas);

      commit('changeLoadingStatus', { status: false, type: 'intro' });
      commit('processDocsYears', { result: responses.docsYears.data });
      commit('processDocsRegions', { result: responses.docsRegions.data });
      commit('processDocsSources', { result: responses.docsSources.data });
      commit('processDocsRessorts', { result: responses.docsRessorts.data });
      // commit('processTopLCs', { result: responses.topLCs.data });
      commit('processCorpInfo', { result: responses.corpInfo.data });
      commit('processTopLemmas', { result: responses.topLemmas.data });
      if (router.currentRoute.params.query) {
        dispatch('corpusQuery', router.currentRoute.params.query);
      }
    } catch (error) {
      console.log(error);
    }
  },
/*   async corpusQueryData({ state, commit, dispatch }, params) {
    try {

      // commit('processRegional', { term: params.term, result: response.data });
      // commit('processDispersion', { term: params.term, result: response.data });
      // commit('processNarrative', { term: params.term, result: response.data[0] });
      // commit('processKWIC', { term: params.term, result: kwicResp.data });
    } catch (error) {
      console.log(error);
    }
  }, */
};

const state = {
  engineAPI: 'https://corpsum-proxy.acdh-dev.oeaw.ac.at/run.cgi/',
  engineAPINoCache: 'https://noske-corpsum.acdh-dev.oeaw.ac.at/run.cgi/',
  selectedCorpus: { name: 'AMC Demo', value: 'amc3_demo', desc: 'A limited-size demo of Austrian Media Corpus' },
  corporaList: [
    { name: 'AMC 3.1', value: 'amc_3.1', desc: 'The latest and full Austrian Media Corpus' },
    { name: 'AMC Demo', value: 'amc3_demo', desc: 'A limited-size demo of Austrian Media Corpus' },
  ],
  selectedSubcorpus: { name: 'None', value: 'none', desc: 'Use the original corpus' },
  subcorporaList: [
    { name: 'None', value: 'none', desc: 'Use the original corpus' },
  ],
  rawResults: [],
  modalTextContent: '',
  loadingStatus: false,
  toggleIntroSection: true,
  toggleVisSection: false,
  corpusInfo: {
    docsrcSizes: [],
    ressortSizes: [],
  },
  chartElements: [
    {
      component: 'corpsumBarChart',
      class: 'col-md-4 vis-component',
      chartProp: 'queryRelSummary',
    },
    /*
    {
      component: 'barChart',
      class: 'col-md-6 vis-component',
      chartProp: 'queryRelSummary',
    },
    */
    {
      component: 'corpsumLineChart',
      class: 'col-md-4 vis-component',
      chartProp: 'temporal',
    },
    /*
    {
      component: 'multiMap',
      class: 'col-md-6 vis-component',
      chartProp: 'regions',
    },
    {
      component: 'treemapChart',
      class: 'col-md-6 vis-component',
      chartProp: 'wordFreqSummary',
    },
    {
      component: 'bubbleChart',
      class: 'col-md-6 vis-component',
      chartProp: 'sources',
    },
    {
      component: 'bubbleChart',
      class: 'col-md-6 vis-component',
      chartProp: 'sections',
    },*/
    {
      component: 'kwicTable',
      class: 'col-md-4 vis-component',
      chartProp: 'kwic',
    },
    /*
    {
      component: 'multiSankey',
      class: 'container-fluid p-0 d-flex',
      chartProp: 'wordTree',
    },
    {
      component: 'multiWordcloud',
      class: 'container-fluid p-0 d-flex',
      chartProp: 'collocations',
    },*/
  ],
  infoElements: [
    {
      component: 'corpusInfoJumbotron',
      class: 'col-md-12 vis-component vis-intro-component',
      chartProp: 'corpusBasicInfo',
    },
    {
      component: 'areaChart',
      class: 'col-md-6 vis-component',
      chartProp: 'docsYears',
    },
    {
      component: 'barChart',
      class: 'col-md-6 vis-component',
      chartProp: 'docsRegions',
    },
    {
      component: 'basicTable',
      class: 'col-md-6 vis-component no-min-height',
      chartProp: 'corpInfoTable',
    },
    {
      component: 'scatterChart',
      class: 'col-md-6 vis-component no-min-height',
      chartProp: 'topLemmas',
    },
    {
      component: 'treemapChart',
      class: 'col-md-6 vis-component',
      chartProp: 'docsSources',
    },
    {
      component: 'treemapChart',
      class: 'col-md-6 vis-component',
      chartProp: 'docsRessorts',
    },
    /*
    {
      component: 'scatterChart',
      class: 'col-md-6 vis-component',
      chartProp: 'topLCs',
    }, */
  ],
  infoData: {
    corpusBasicInfo: {
      logo: 'https://www.oeaw.ac.at/fileadmin/_processed_/6/8/csm_acdh_projects_amc_logo_web_a92e4e1d33.png',
      desc: 'The Austrian Media Corpus (amc), created as part of a cooperation between the Austrian Academy of Sciences and the Austrian Press Agency (APA), covers the entire Austrian media landscape of the past decades, comprising a wide range of text types which can be classified as journalistic prose. Altogether, the corpus contains 40 million texts, constituting more than 10 billion tokens. In comparison to other contemporary German language corpora, the amc ranks among the largest collection of its kind.',
    },
    docsYears: {
      title: 'Number of Tokens per Year',
      subtitle: 'This chart displays the yearly distribution of tokens in the selected corpus.',
      yAxisText: 'Number of Tokens',
      data: [],
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
    },
    docsRegions: {
      title: 'Number of Documents per Region',
      subtitle: 'This chart displays the regional distribution of documents in the selected corpus. Every media source has a region identifier. However some media sources can be nation-wide publication or too specific to be categorized under a specific region.',
      yAxisText: 'Number of Documents',
      categoriesX: [
        'AT-Nationwide',
        'AT-Ost',
        'AT-Südost',
        'AT-Mitte',
        'AT-West',
        'Specific',
      ],
      series: [],
    },
    corpInfoTable: {
      title: 'Unit Sizes of the Corpus',
      subtitle: 'An annotated text corpus consists of structured elements such as documents, paragraphs, sentences, words and tokens. Tokens are the smallest units, which are symbols, numbers and lemmas. The size of a corpus is generally described by its total count of tokens and documents.',
      items: [],
      fields: [
        { key: 'unit', label: 'Unit', sortable: true },
        { key: 'count', label: 'Count', sortable: true },
      ],
      height: 360,
    },
    topLemmas: {
      title: 'The Most Frequent Lemmas',
      subtitle: "This chart displays the most frequent lemmas in this corpus. On the y-axis the the absolute frequency and on the x-axis the ranking of this word form is displayed. This type of distribution is also known as the <a target='_blank' href='https://en.wikipedia.org/wiki/Zipf%27s_law'>Zipf's Curve / Law</a>, where the ranking of the most frequent words are disproportional with their absolute frequencies.",
      legendEnabled: true,
      series: [],
      yAxisText: 'Absolute Frequency',
      xAxisText: 'Ranking',
      height: 315,
    },
    docsSources: {
      title: 'Number of Documents per Media Source',
      subtitle: 'This chart displays the distribution of documents in the selected corpus per media source.',
      data: [],
    },
    docsRessorts: {
      title: 'Number of Documents per Newspaper Section',
      subtitle: 'This chart displays the distribution of documents in the selected corpus per newspaper section / ressort.',
      data: [],
    },
    /*
    topLCs: {
      title: 'The Most Frequent Word Forms',
      subtitle: "This chart displays the most frequent word forms (case insensitive) in this corpus. On the y-axis the the absolute frequency and on the x-axis the ranking of this word form is displayed. This type of distribution is also known as the <a target='_blank' href='https://en.wikipedia.org/wiki/Zipf%27s_law'>Zipf's Curve / Law</a>, where the ranking of the most frequent words are disproportional with their absolute frequencies.",
      legendEnabled: true,
      series: [],
      yAxisText: 'Absolute Frequency',
      xAxisText: 'Ranking',
    }, */
  },
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
      title: 'Total Absolute Frequency and Word Forms',
      subtitle: 'Total absolute number of occurences (hits) of a given query is displayed. If the query has multiple words in results these are displayed in the second level with a click.',
      yAxisText: 'Number of Hits',
      xAxisType: 'category',
      legendEnabled: false,
      series: [{ name: 'Absolute Frequency', data: [], colorByPoint: true }],
    },
    queryRelSummary: {
      title: 'Fr. and Forms',
      subtitle: 'Total normalised frequency (per million tokens) of a given query is displayed.',
      yAxisText: 'Frequency per million tokens',
      xAxisType: 'category',
      legendEnabled: false,
      series: [{ name: 'Normalised Frequency', data: [], wordForms: [], colorByPoint: true }],
    },
    wordFreqSummary: {
      title: 'Total Absolute Frequency and Word Forms',
      subtitle: 'Total absolute number of occurences (hits) of a given query is displayed. If the query has multiple words in results these are displayed in the second level with a click.',
      data: [],
    },
    wordTree: {
      charts: [],
    },
    temporal: {
      title: 'Yearly Frequencies',
      absolute: {
        title: 'Yearly Absolute Frequency',
        subtitle: 'Absolute number of occurences (hits) of a given query in years is displayed.',
        yAxisText: 'Number of Hits',
        data: [],
      },
      relative: {
        title: 'Yearly Relative Frequency',
        subtitle: 'Relative comparison to the baseline (100%) for the query in years is displayed. This way of distribution shows how much more / less frequent the result of the query in this partition exists in comparison to the whole corpus. 100% represents the average baseline from the whole corpus.',
        yAxisText: 'Relative Frequency per Million Tokens',
        data: [],
      },
      wordForms: {
        absolute: {
          data: [],
        },
        relative: {
          data: [],
        },
      },
    },
    sources: {
      title: 'Distribution of Media Sources',
      subtitle: 'This chart displays the absolute number of hits of this query (y-axis) and relative frequency (x-axis) in comparison to the baseline (100%) for the query per media source. Sizes of the points show the absolute size of the media sources in the whole corpus, independent from the given query. Relative Frequency (%) shows how much more / less frequent the result of the query in this partition exists in comparison to the whole corpus. 100% represents the average baseline from the whole corpus.',
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
      title: 'Distribution of Newspaper Sections',
      subtitle: 'This chart displays the absolute number of hits of this query (y-axis) and relative frequency (x-axis) in comparison to the baseline (100%) for the query per newspaper section. Sizes of the points show the absolute size of the newspaper sections in the whole corpus, independent from the given query. Relative Frequency (%) shows how much more / less frequent the result of the query in this partition exists in comparison to the whole corpus. 100% represents the average baseline from the whole corpus.',
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
      mapTitle: 'Regional Relative Frequency (%)',
      mapSubtitle: 'Relative comparison to the baseline (100%) for the query in regions is displayed. This way of distribution shows how much more / less frequent the result of the query in this partition exists in comparison to the whole corpus. 100% represents the average baseline from the whole corpus.',
      title: 'Regional Absolute Frequency',
      subtitle: 'This chart displays the absolute number of occurences (hits) of a given query per regions in the selected corpus. Every media source has a region identifier. However some media sources can be nation-wide publication or too specific to be categorized under a specific region.',
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
      relativeMaps: [],
      absoluteMaps: [],
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
        {
          key: 'actions', label: 'View', sortable: false, thStyle: { width: '45px' }, class: 'text-center',
        },
        {
          key: 'selected', label: 'All', sortable: false, thStyle: { width: '50px' }, class: 'text-center',
        },
        /*
        {
          key: 'date', label: 'Date', sortable: true, thStyle: { width: '100px' },
        },
        {
          key: 'source', label: 'Source', sortable: true, thStyle: { width: '250px' },
        },
        {
          key: 'region', label: 'Region', sortable: true, thStyle: { width: '80px' },
        },*/
        {
          key: 'left', label: 'Left', sortable: true, class: 'text-right',
        },
        {
          key: 'word', label: 'Word', sortable: true, class: 'text-center kwic-word',
        },
        {
          key: 'right', label: 'Right', sortable: true, class: 'text-left',
        },
      ],
      height: 600,
    },
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
