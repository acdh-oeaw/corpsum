<template>
    <main role="main" class="col-md-10 ml-sm-auto col-lg-11 px-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-0 border-bottom">
<!--       <div>
        <h6>Sample Queries: </h6>
        <b-button class="mr-2" variant="primary" size="sm" @click="changeSampleQuery(1)">Car: coche / carro / auto</b-button>
        <b-button class="mr-2" variant="secondary" size="sm" @click="changeSampleQuery(2)">Cellphone: teléfono celular / teléfono móvil</b-button>
        <b-button class="mr-2" variant="success" size="sm" @click="changeSampleQuery(3)">Spelling Changes: Iraq / Irak</b-button>
      </div> -->
        <div class="btn-toolbar mb-2 mb-md-0">
          <b-button variant="danger" size="sm" @click="resetQuery">Reset Query</b-button>
        </div>
      </div>
      <div class="home">
        <div class="row vis-wrapper">

          <component
            v-for="element in chartElements"
            v-bind:key="element.key"
            v-bind:is="element.component"
            v-bind:chartProp="chartData[element.chartProp]"
            v-bind:class="element.class"
          />

<!--           <radarChart class="col-md-4 vis-component"></radarChart>
          <lineChart :chartProp="chartData.temporal.absolute" class="col-md-4 vis-component"></lineChart>
          <lineChart :chartProp="chartData.temporal.relative" class="col-md-4 vis-component"></lineChart>
          <interactiveTable :tableData="chartData.kwic" class="col-md-12 vis-component"></interactiveTable>
          <stackedBarChart :chartProp="chartData.narrative" class="col-md-4 vis-component"></stackedBarChart>
          <heatmapChart class="col-md-8 vis-component"></heatmapChart>
          <genericChart :chartProp="chartData.regional.countries" class="col-md-8 vis-component"></genericChart>
          <mapChart class="col-md-4 vis-component"></mapChart> -->
        </div>
      </div>
    </main>
</template>

<script>
// @ is an alias to /src
// import mapChart from '@/components/d3-charts/map.vue';

import radarChart from '@/components/charts/radarChart.vue'
import lineChart from '@/components/charts/lineChart.vue'
import barChart from '@/components/charts/barChart.vue'
import queryBuilder from '@/components/ui-elements/queryBuilder.vue'
import stackedBarChart from '@/components/charts/stackedBarChart.vue'
import heatmapChart from '@/components/charts/heatmapChart.vue'
import mapChart from '@/components/charts/mapChart.vue'
import genericChart from '@/components/charts/genericChart.vue'
import scatterChart from '@/components/charts/scatterChart.vue'
import interactiveTable from '@/components/ui-elements/interactiveTable.vue'
import kwicTable from '@/components/ui-elements/kwicTable.vue'
import visSeparator from '@/components/ui-elements/visSeparator.vue'
import multiMap from '@/components/charts/multiMap.vue'
import multiWordcloud from '@/components/charts/multiWordcloud.vue'

export default {
  name: 'analysis',
  components: {
    radarChart, lineChart, barChart, queryBuilder, stackedBarChart, heatmapChart, mapChart, genericChart, scatterChart, interactiveTable, kwicTable, visSeparator, multiMap, multiWordcloud
  },
  data() {
    return {
    };
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");

/*     var pckry = new Packery( '.vis-wrapper', {
      itemSelector: '.vis-component',
      columnWidth: ".vis-component.col-md-4",
      gutter: 0,
      percentPosition: true
    });

    pckry.getItemElements().forEach( function( itemElem ) {
      var draggie = new Draggabilly( itemElem, { handle: '.highcharts-title' } );
      pckry.bindDraggabillyEvents( draggie );
    }); */
  },
  watch: {
  },
  computed: {
    chartData() {
      return this.$store.getters.chartData
    },
    chartElements() {
      return this.$store.getters.chartElements
    },
  },
  methods: {
    resetQuery() {
      // this.$store.commit('resetState', 'Ball');
      this.$store.dispatch('corpusQuery', 'Ball');
    },
    changeSampleQuery(querySet) {
      console.log(this.initialChartDataState)
      if (querySet == 1) {
        const queryTerms = ['coche','carro','auto'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      } else if (querySet == 2) {
        const queryTerms = ['teléfono celular', 'teléfono móvil'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      } else if (querySet == 3) {
        const queryTerms = ['Iraq', 'Irak'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      }
      //this.$store.dispatch('corpusQuery', queryTerm);
      //store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
      /*
      this.initialSearchQuery(this.chartData, queryTerm)
        .then((response) => {
          this.chartData = response;
          this.$store.commit('chartDataUpdate', this.chartData);
        });
        */
    },
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

.vis-component, .vis-separator {
  padding: .5rem!important;
}
</style>