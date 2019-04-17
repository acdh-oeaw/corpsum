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
                class="vis-el"
                :data="freqTemporalData"
                width="100%"
                height="300px">
            </d3-multi-line>

            <billboard-chart :options="chartData"></billboard-chart>

            <vue-plotly :data="data" :layout="layout" :options="options"/>


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
import VuePlotly from '@statnett/vue-plotly'
//import {bb} from 'billboard.js'


export default {
  name: 'home',
  components: {
    sideNav, mapChart, VuePlotly
    // HelloWorld,
  },
  mixins: [corpusInterface],
  data() {
    return {
      freqTemporalData: [],
      mapData: [],
      queryTerms: ["coche"],
      chartData: {
        title: {
          text: 'sample chart'
        },
        data: {
          columns: [
            ['data3', 300, 200, 160, 400, 250, 250]
          ],
          type: 'spline'
        }
      },
      data: [{
    type: 'scattergeo',
    mode: 'markers',
    locations: ['FRA', 'DEU', 'RUS', 'ESP'],
    marker: {
        size: [20, 30, 15, 10],
        color: [10, 20, 40, 50],
        cmin: 0,
        cmax: 50,
        colorscale: 'Greens',
        colorbar: {
            title: 'Some rate',
            ticksuffix: '%',
            showticksuffix: 'last'
        },
        line: {
            color: 'black'
        }
    },
    name: 'europe data'
}],
      layout: {
    'geo': {
        'scope': 'world',
        'resolution': 50
    }
},
      options: {displaylogo: false}
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
      this.initialSearchQuery(this.freqTemporalData, this.mapData, queryTerm)
        .then((response) => {
        this.freqTemporalData = response.temporal;
        this.mapData = response.regional;
      });
    },
    onQueryTermRemoved(queryTerm) {
      this.freqTemporalData = this.freqTemporalData.filter(function( termData ) {
          return termData.group !== queryTerm;
      });
      this.mapData = this.mapData.filter(function( termData ) {
          return termData.group !== queryTerm;
      });
    },
  },
};
</script>
