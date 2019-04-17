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

            <vue-plotly class="col-md-6" :data="temporalData.absolute" :layout="freqTemporalLayout" :options="freqTemporalOptions"/>

            <vue-plotly class="col-md-6" :data="temporalData.relative" :layout="relFreqTemporalLayout" :options="relFreqTemporalOptions"/>

            <mapChart class="vis-el" :mapData="mapData"></mapChart>

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
import corpusInterface from '@/interfaces/corpusInterface';
import VuePlotly from '@statnett/vue-plotly';
// import {bb} from 'billboard.js'


export default {
  name: 'home',
  components: {
    sideNav, mapChart, VuePlotly,
  },
  mixins: [corpusInterface],
  data() {
    return {
      temporalData: { absolute: [], relative: [] },
      freqTemporalLayout: {title:'Temporal distribution of absolute frequencies'},
      freqTemporalOptions: {displaylogo: false, responsive: true /* displayModeBar: false */ },
      relFreqTemporalLayout: {title:'Temporal distribution of relative frequencies'},
      relFreqTemporalOptions: {displaylogo: false, responsive: true /* displayModeBar: false */ },
      mapData: [],
      queryTerms: ["coche"],
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    onQueryTermAdded(queryTerm) {
      this.initialSearchQuery(this.temporalData, this.mapData, queryTerm)
        .then((response) => {
          this.temporalData = response.temporal;
          this.mapData = response.regional;
        });
    },
    onQueryTermRemoved(queryTerm) {
      this.freqTemporalData.absolute = this.freqTemporalData.absolute.filter(termData => termData.name !== queryTerm);
      this.freqTemporalData.relative = this.freqTemporalData.relative.filter(termData => termData.name !== queryTerm);
      this.mapData = this.mapData.filter(termData => termData.name !== queryTerm);
    },
  },
};
</script>
