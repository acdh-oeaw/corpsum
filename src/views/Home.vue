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

            <div class="row">
              <vue-plotly
              class="col-md-4"
              :data="chartData.dispersion"
              :layout="{
                title: 'Dispersion measures of the dimensions',
                margin: { r: 30, t: 30, b: 30, l: 30 },
                height: 300,
                polar: {
                  radialaxis: {
                    visible: true,
                    range: [0, 1],
                  },
                },
              }"
              :options="dispersionOptions"
              />

              <vue-plotly class="col-md-4" :data="chartData.temporal.absolute" :layout="freqTemporalLayout" :options="freqTemporalOptions"/>

              <vue-plotly class="col-md-4" :data="chartData.temporal.relative" :layout="relFreqTemporalLayout" :options="relFreqTemporalOptions"/>
            </div>

            <div class="row">
              <div class="col-md-3">
                <vue-plotly class="col-md-12" :data="regionalData" :layout="regionalLayout" :options="regionalOptions"/>
                <vue-plotly class="col-md-12" :data="regionalData" :layout="regionalLayout" :options="regionalOptions"/>
                <vue-plotly class="col-md-12" :data="regionalData" :layout="regionalLayout" :options="regionalOptions"/>
                <vue-plotly class="col-md-12" :data="regionalData" :layout="regionalLayout" :options="regionalOptions"/>
              </div>

              <mapChart class="col-md-9 vis-el" :mapData="chartData.regional"></mapChart>

            </div>

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
      chartData: {
        temporal: { absolute: [], relative: [] },
        regional: [],
        dispersion: [],
      },
      freqTemporalLayout: {
        title:'Temporal distribution of absolute frequencies',
        margin: { r: 30, t: 30, b: 30, l: 30 },
        height: 300,
      },
      freqTemporalOptions: {displaylogo: false, responsive: true, displayModeBar: false },
      relFreqTemporalLayout: {
        title:'Temporal distribution of relative frequencies',
        margin: { r: 30, t: 30, b: 30, l: 30 },
        height: 300,
      },
      relFreqTemporalOptions: {displaylogo: false, responsive: true, displayModeBar: false },
      regionalData: [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: ['Argentine', 'Spain', 'Colombia', 'Mexico'],
        z: [150, 200, 90, 35],
        text: ['Argentine', 'Spain', 'Colombia', 'Mexico'],
        autocolorscale: true,
        colorbar: {
          x: -0.15999999999999992, 
          y: 0.5, 
          lenmode: 'fraction', 
          thickness: 15, 
          thicknessmode: 'pixels', 
          tickangle: 'auto', 
          tickmode: 'auto', 
          ticks: '', 
          title: {side: 'top'}, 
          xanchor: 'left', 
          yanchor: 'middle', 
          ypad: 20
        },
        showscale: false,
      }],
      regionalLayout: {
        title: 'Regional distribution of the results',
        height: 200,
        margin: { r: 10, t: 30, b: 20, l: 10 }, 
        geo: {
          center: {
            lat: -5.1017044588664975, 
            lon: -29.237649476804474
          }, 
          projection: {
            scale: 1.7438683100062125, 
            type: 'equirectangular'
          }
        }
      },
      regionalOptions: {displaylogo: false, responsive: true, displayModeBar: false },
      dispersionOptions: {displaylogo: false, responsive: true, displayModeBar: false },
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
      this.initialSearchQuery(this.chartData, queryTerm)
        .then((response) => {
          this.chartData = response;
        });
    },
    onQueryTermRemoved(queryTerm) {
      this.chartData.temporal.absolute = this.chartData.temporal.absolute.filter(termData => termData.name !== queryTerm);
      this.chartData.temporal.relative = this.chartData.temporal.relative.filter(termData => termData.name !== queryTerm);
      this.chartData.regional = this.chartData.regional.filter(termData => termData.name !== queryTerm);
      this.chartData.dispersion = this.chartData.dispersion.filter(termData => termData.name !== queryTerm);
    },
  },
};
</script>
