<template>
  <div id="app">
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-2 col-md-1 mr-0" href="#">vis-corpus</a>
      <tags-input element-id="queryTerms" class="w-100"
        v-model="queryTerms"
        placeholder="Type another term to query"
        @tag-added="onQueryTermAdded"
        @tag-removed="onQueryTermRemoved">
      </tags-input>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#">Sign out</a>
        </li>
      </ul>
    </nav>
    <div class="container-fluid">
      <div class="row">

        <sideNav></sideNav>

        <main role="main" class="col-md-10 ml-sm-auto col-lg-11 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                Dropdown
              </button>
            </div>
          </div>

          <div class="home">
            <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

            <d3-multi-line
                :data="freqTemporalData"
                width="100%"
                height="300px">
            </d3-multi-line>

            <mapChart></mapChart>
            <!--
            <d3-l-choropleth :data="mapData">
            </d3-l-choropleth>
            -->
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import sideNav from '@/components/sideNav.vue';
import mapChart from '@/components/d3-charts/map.vue';
import corpusInterface from '@/mixins/corpusInterface';

export default {
  name: 'home',
  components: {
    sideNav, mapChart,
    // HelloWorld,
  },
  mixins: [corpusInterface],
  data() {
    return {
      freqTemporalData: [],
      mapData: { coordinates: [{ lat: -25.363, lng: 131.044 }, { lat: 12.97, lng: 77.59 }] },
      queryTerms: ['haus'],
      engineApi: 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/',
      timeFreqQuery: 'freqtt?corpname=amc3_demo&format=json&fttattr=doc.year',
    };
  },
  created() {
  },
  mounted() {
    console.log('Home loaded');
    console.log(this.$corpusProvider);
    // this.fetchMapData();
  },
  watch: {
  },
  methods: {
    onQueryTermAdded(queryTerm) {
      this.fetchData(queryTerm);
    },

    onQueryTermRemoved(queryTerm) {
      this.freqTemporalData = this.freqTemporalData.filter(function( termData ) {
          return termData.group !== queryTerm;
      });
    },
    fetchData(queryTerm) {
      if (queryTerm) {
        this.axios.get(`${this.engineApi + this.timeFreqQuery}&q=q[lc="${queryTerm}"]`)
          .then((response) => {
            const wordFreq = this.processFreqTemporalData(response.data, queryTerm);
            this.freqTemporalData = this.freqTemporalData.concat(wordFreq);
            console.log(this.freqTemporalData);
          });
      }
    },
    fetchMapData() {
      this.axios.get('https://raw.githubusercontent.com/timwis/leaflet-choropleth/gh-pages/examples/basic/crimes_by_district.geojson')
        .then((response) => {
          this.mapData = response.data.features;
          console.log(response.data.features);
        });
    },
  },
};
</script>
