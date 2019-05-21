<template>
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
        <div class="row vis-wrapper">
          <sortableTable :tableData="tableData" class="col-md-12 vis-component"></sortableTable>
          <radarChart class="col-md-4 vis-component"></radarChart>
          <lineChart :chartProp="chartData.temporal.absolute" class="col-md-4 vis-component"></lineChart>
          <lineChart :chartProp="chartData.temporal.relative" class="col-md-4 vis-component"></lineChart>
          <stackedBarChart :chartProp="chartData.narrative" class="col-md-4 vis-component"></stackedBarChart>
          <heatmapChart class="col-md-4 vis-component"></heatmapChart>
          <stackedBarChart :chartProp="chartData.regional.countries" class="col-md-4 vis-component"></stackedBarChart>
          <mapChart class="col-md-12 vis-component"></mapChart>
        </div>
      </div>
    </main>
</template>

<script>
// @ is an alias to /src
// import mapChart from '@/components/d3-charts/map.vue';

import radarChart from '@/components/charts/radarChart.vue'
import lineChart from '@/components/charts/lineChart.vue'
import stackedBarChart from '@/components/charts/stackedBarChart.vue'
import heatmapChart from '@/components/charts/heatmapChart.vue'
import mapChart from '@/components/charts/mapChart.vue'
import sortableTable from '@/components/charts/sortableTable.vue'

export default {
  name: 'analysis',
  components: {
    radarChart, lineChart, stackedBarChart, heatmapChart, mapChart, sortableTable
  },
  data() {
    return {
      chartData: this.$store.getters.chartData,
      tableData: [['jo',20],['jane',50],['james',30]]
    };
  },
  created() {
  },
  mounted() {
    console.log("mounted");
    var pckry = new Packery( '.vis-wrapper', {
      itemSelector: '.vis-component',
      columnWidth: ".vis-component.col-md-4",
      gutter: 0,
      percentPosition: true
    });

    pckry.getItemElements().forEach( function( itemElem ) {
      var draggie = new Draggabilly( itemElem );
      pckry.bindDraggabillyEvents( draggie );
    });
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

.vis-component {
  padding: .5rem!important;
}
</style>