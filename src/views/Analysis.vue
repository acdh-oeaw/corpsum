<template>
    <main role="main" class="ml-auto px-4">
      <div class="home pt-3">
        <div class="row vis-intro-wrapper" v-show="toggleIntroSection">
          <div class="col-md-12 vis-component">
            <div class="vis-component-inner">
              <b-jumbotron bg-variant="white" header-level="4" class="py-3 mb-3">
                <template slot="header">Corpus Analysis</template>
                <template slot="lead">
                  This dashboard allows you to analyze the results of your corpus queries in multiple dimensions and with visualization components.
                  <br/>
                  You can start by typing your query in the above search bar or clicking the below button for some examples.
                </template>
                <b-button variant="success" @click="exampleQuery()">Try Example Query</b-button>
              </b-jumbotron>
            </div>
          </div>
        </div>

        <div class="row vis-wrapper" v-show="toggleVisSection">
          <component
            v-for="(element, index) in chartElements"
            v-bind:key="element.key"
            v-bind:is="element.component"
            v-bind:chartProp="chartData[element.chartProp]"
            v-bind:class="element.class"
            v-bind:elKey="index"
          />
        </div>
      </div>
    </main>
</template>

<script>
// @ is an alias to /src
// import radarChart from '@/components/charts/radarChart.vue'
import wrapperLineChart from '@/components/charts/wrapperLineChart.vue';
import barChart from '@/components/charts/barChart.vue';
// import queryBuilder from '@/components/ui-elements/queryBuilder.vue'
// import stackedBarChart from '@/components/charts/stackedBarChart.vue'
// import heatmapChart from '@/components/charts/heatmapChart.vue'
// import mapChart from '@/components/charts/mapChart.vue'
// import genericChart from '@/components/charts/genericChart.vue'
// import scatterChart from '@/components/charts/scatterChart.vue'
// import interactiveTable from '@/components/ui-elements/interactiveTable.vue'
import kwicTable from '@/components/ui-elements/kwicTable.vue';
// import visSeparator from '@/components/ui-elements/visSeparator.vue'
import multiMap from '@/components/charts/multiMap.vue';
import multiWordcloud from '@/components/charts/multiWordcloud.vue';
import treemapChart from '@/components/charts/treemapChart.vue';
import bubbleChart from '@/components/charts/bubbleChart.vue';
import multiSankey from '@/components/charts/multiSankey.vue';

import corpsumBarChart from '@/components/charts/corpsumBarChart.vue';
import corpsumLineChart from '@/components/charts/corpsumLineChart.vue';

export default {
  name: 'analysis',
  components: {
    wrapperLineChart, barChart, kwicTable, multiMap, multiWordcloud, treemapChart, bubbleChart, multiSankey, corpsumBarChart, corpsumLineChart
  },
  data() {
    return {
    };
  },
  created() {
    console.log('created');
  },
  mounted() {
    console.log('mounted');
  },
  watch: {
  },
  computed: {
    chartData() {
      return this.$store.getters.chartData;
    },
    chartElements() {
      return this.$store.getters.chartElements;
    },
    toggleIntroSection() {
      return this.$store.getters.toggleIntroSection;
      (value) => console.log(value); // this.$state.commit('someMutation', value )
    },
    toggleVisSection() {
      return this.$store.getters.toggleVisSection;
      (value) => console.log(value); // this.$state.commit('someMutation', value )
    },
  },
  methods: {
    resetQuery() {
      // this.$store.commit('resetState', 'Ball');
      this.$store.dispatch('corpusQuery', 'Ball');
    },
    exampleQuery() {
      const queryTerms = [{ text: '[lc=".*leben.*"]', tiClasses: ['ti-valid'] }, { text: '[lc=".*arbeit.*"]', tiClasses: ['ti-valid'] }];
      for (let i = 0; i < queryTerms.length; i += 1) {
        this.$store.commit('queryTermAdded', queryTerms[i]);
        this.$store.dispatch('corpusQuery', queryTerms[i].text);
      }
    },
    changeSampleQuery(querySet) {
      console.log(this.initialChartDataState);
      if (querySet == 1) {
        const queryTerms = ['coche', 'carro', 'auto'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      } else if (querySet == 2) {
        const queryTerms = ['teléfono celular', 'teléfono móvil'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      } else if (querySet === 3) {
        const queryTerms = ['Iraq', 'Irak'];
        this.$store.commit('resetChartData', this.initialChartDataState);
        this.$store.commit('resetQueryTerms', queryTerms);
      }
      // this.$store.dispatch('corpusQuery', queryTerm);
      // store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
      /*
      this.initialSearchQuery(this.chartData, queryTerm)
        .then((response) => {
          this.chartData = response;
          this.$store.commit('chartDataUpdate', this.chartData);
        });
        */
    },
    onQueryTermAdded(queryTerm) {
      console.log(queryTerm);
      /*
      this.initialSearchQuery(this.chartData, queryTerm)
        .then((response) => {
          this.chartData = response;
          this.$store.commit('chartDataUpdate', this.chartData);
        });
        */
    },
    onQueryTermRemoved(queryTerm) {
      this.chartData.temporal.absolute = this.chartData.temporal.absolute.filter((termData) => termData.name !== queryTerm);
      this.chartData.temporal.relative = this.chartData.temporal.relative.filter((termData) => termData.name !== queryTerm);
      this.chartData.regional.countries = this.chartData.regional.countries.filter((termData) => termData.name !== queryTerm);
      this.chartData.dispersion = this.chartData.dispersion.filter((termData) => termData.name !== queryTerm);
      this.chartData.types = this.chartData.types.filter((termData) => termData.name !== queryTerm);
      this.$store.commit('chartDataUpdate', this.chartData);
    },
  },
};
</script>

<style lang="scss">
</style>
