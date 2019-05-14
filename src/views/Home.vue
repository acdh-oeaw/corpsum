<template>
  <div id="app">
    <topNav/>
    <div class="container-fluid">
      <div class="row">
        <sideNav/>
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
            <div class="row">
              <radarChart class="col-md-4 vis-component"></radarChart>
              <lineChart :lineData="chartData.temporal.absolute" class="col-md-4 vis-component"></lineChart>
              <lineChart :lineData="chartData.temporal.relative" class="col-md-4 vis-component"></lineChart>
              <!--
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
              -->
            </div>
            <div class="row">
              <!--
              <vue-plotly class="col-md-6"
                :data="chartData.types"
                :layout="{
                  title: 'Distribution of publication type per query',
                  barmode: 'stack'
                }"
              />
              -->
              <stackedBarChart class="col-md-4 vis-component"></stackedBarChart>
              <heatmapChart class="col-md-8 vis-component"></heatmapChart>
              <!--
              <vue-plotly class="col-md-12" :data="chartData.regional.regions" :layout="heatmapLayout"/>-->
            </div>
            <div class="row">
              <mapChart class="col-md-12"></mapChart>
              <vue-plotly class="col-md-12" :data="regionalData" :layout="regionalLayout" :options="regionalOptions"/>
              <!--<mapChart class="col-md-9 vis-el" :mapData="chartData.regional.countries"/>-->
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store/store';
import topNav from '@/components/topNav.vue';
import sideNav from '@/components/sideNav.vue';
// import mapChart from '@/components/d3-charts/map.vue';
import corpusInterface from '@/interfaces/corpusInterface';
import VuePlotly from '@statnett/vue-plotly';

import radarChart from '@/components/charts/radarChart.vue'
import lineChart from '@/components/charts/lineChart.vue'
import stackedBarChart from '@/components/charts/stackedBarChart.vue'
import heatmapChart from '@/components/charts/heatmapChart.vue'
import mapChart from '@/components/charts/mapChart.vue'

export default {
  name: 'home',
  store,
  components: {
    topNav, sideNav, VuePlotly, radarChart, lineChart, stackedBarChart, heatmapChart, mapChart
  },
  mixins: [corpusInterface],
  data() {
    return {
      chartData: this.$store.getters.chartData,
      freqTemporalLayout: {
        title: 'Temporal distribution of absolute frequencies',
        margin: {
          r: 30, t: 30, b: 30, l: 30,
        },
        height: 300,
      },
      freqTemporalOptions: { displaylogo: false, responsive: true, displayModeBar: false },
      relFreqTemporalLayout: {
        title: 'Temporal distribution of relative frequencies',
        margin: {
          r: 30, t: 30, b: 30, l: 30,
        },
        height: 300,
      },
      relFreqTemporalOptions: { displaylogo: false, responsive: true, displayModeBar: false },
      /*
      regionalData: [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: ['Argentine', 'Spain', 'Colombia', 'Mexico', 'Chile', 'United States of America', 'Venezuela'],
        z: [150, 200, 90, 35, 40, 80, 130],
        text: ['Argentine', 'Spain', 'Colombia', 'Mexico', 'Chile', 'United States of America', 'Venezuela'],
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
          title: { side: 'top' },
          xanchor: 'left',
          yanchor: 'middle',
          ypad: 20,
        },
        showscale: false,
      }],
      */
      regionalData: [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: ['Argentine', 'Spain', 'Colombia', 'Mexico', 'Chile', 'United States of America', 'Venezuela'],
        z: [150, 200, 90, 35, 40, 80, 130],
        text: ['Argentine', 'Spain', 'Colombia', 'Mexico', 'Chile', 'United States of America', 'Venezuela'],
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
          title: { side: 'top' },
          xanchor: 'left',
          yanchor: 'middle',
          ypad: 20,
        },
        showscale: false,
      }],
      regionalLayout: {
        title: 'Regional distribution of the results',
        height: 200,
        margin: {
          r: 10, t: 30, b: 20, l: 10,
        },
        geo: {
          center: {
            lat: -5.1017044588664975,
            lon: -29.237649476804474,
          },
          projection: {
            scale: 1.7438683100062125,
            type: 'equirectangular',
          },
        },
      },
      regionalOptions: { displaylogo: false, responsive: true, displayModeBar: false },
      dispersionOptions: { displaylogo: false, responsive: true, displayModeBar: false },
      heatmapLayout: {
        title: 'Heatmap view of regions in relative frequencies',
        margin: {
          r: 60, t: 50, b: 100, l: 60,
        },
        height: 300,
      },
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    /*
    chartData () {
      return this.$store.getters.chartData;
    }
    */
  },
  methods: {
    onQueryTermAdded(queryTerm) {
      console.log(queryTerm)
      /*
      this.initialSearchQuery(this.chartData, queryTerm)
        .then((response) => {
          this.chartData = response;
          this.$store.commit('chartDataUpdate', this.chartData);
        });
        */
    },
    onQueryTermRemoved(queryTerm) {
      this.chartData.temporal.absolute = this.chartData.temporal.absolute.filter(termData => termData.name !== queryTerm);
      this.chartData.temporal.relative = this.chartData.temporal.relative.filter(termData => termData.name !== queryTerm);
      this.chartData.regional.countries = this.chartData.regional.countries.filter(termData => termData.name !== queryTerm);
      this.chartData.dispersion = this.chartData.dispersion.filter(termData => termData.name !== queryTerm);
      this.chartData.types = this.chartData.types.filter(termData => termData.name !== queryTerm);
      this.$store.commit('chartDataUpdate', this.chartData);
    },
  },
};
</script>

<style lang="scss">
.vis-component > div {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
</style>