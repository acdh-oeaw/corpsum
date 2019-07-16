<template>
    <main role="main" class="ml-auto px-4">
      <div class="home pt-3">
        <div class="row vis-wrapper">
          <component
            v-for="(element, index) in infoElements"
            v-bind:key="element.key"
            v-bind:is="element.component"
            v-bind:chartProp="infoData[element.chartProp]"
            v-bind:class="element.class"
            v-bind:elKey="index"
          />
        </div>
      </div>
    </main>


<!--     <main role="main" class="col-md-10 ml-sm-auto col-lg-11 px-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-0 border-bottom">
        <h3>Corpus Information</h3>
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
          <corpusDescription :chartProp="infoData.corpusDescription" class="col-md-12 vis-component"></corpusDescription>
          <basicStats :chartProp="infoData.basicStats[0]" class="col-md-4 vis-component"></basicStats>
          <basicStats :chartProp="infoData.basicStats[1]" class="col-md-4 vis-component"></basicStats>
          <basicStats :chartProp="infoData.basicStats[2]" class="col-md-4 vis-component"></basicStats>
          <stackedBarChart :chartProp="infoData.mostUsed" class="col-md-4 vis-component"></stackedBarChart>
          <lineChart :chartProp="infoData.yearsData" class="col-md-8 vis-component"></lineChart>
          <genericChart :chartProp="infoData.themesData" class="col-md-8 vis-component"></genericChart>
        </div>
      </div>
    </main> -->
</template>

<script>
// @ is an alias to /src
import corpusInfoJumbotron from '@/components/ui-elements/corpusInfoJumbotron.vue'
import areaChart from '@/components/charts/areaChart.vue'
import lineChart from '@/components/charts/lineChart.vue'
import barChart from '@/components/charts/barChart.vue'
import kwicTable from '@/components/ui-elements/kwicTable.vue'
import multiMap from '@/components/charts/multiMap.vue'
import multiWordcloud from '@/components/charts/multiWordcloud.vue'
import treemapChart from '@/components/charts/treemapChart.vue'
import bubbleChart from '@/components/charts/bubbleChart.vue'
import scatterChart from '@/components/charts/scatterChart.vue'
import multiSankey from '@/components/charts/multiSankey.vue'
import basicTable from '@/components/ui-elements/basicTable.vue'

export default {
  name: 'info',
  components: {
    corpusInfoJumbotron, areaChart, lineChart, barChart, kwicTable, multiMap, multiWordcloud, treemapChart, scatterChart, bubbleChart, multiSankey, basicTable
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
  },
  watch: {
  },
  computed: {
    infoData() {
      return this.$store.getters.infoData
    },
    infoElements() {
      return this.$store.getters.infoElements
    },
  },
  methods: {
  },
};
</script>

<style lang="scss">
</style>