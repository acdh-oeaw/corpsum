<template>
  <div :key="componentKey">
    <div class="vis-component-inner">
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>
        <div class="actions ml-auto">
          <b-button variant="info" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="info" @click="showChart" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <bar-chart-2-icon></bar-chart-2-icon>
          </b-button>
          <b-button variant="info" @click="exportCSV" v-b-tooltip.hover title="Export data as CSV">
            <download-icon></download-icon>
          </b-button>
          <b-button variant="info" @click="exportImage" v-b-tooltip.hover title="Export image as SVG">
            <image-icon></image-icon>
          </b-button>
        </div>
      </div>
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.title" ok-only scrollable>{{this.chartProp.subtitle}}</b-modal>
      <choroplethMap
        v-for="(element, index) in maps"
        v-bind:key="element.id"
        v-bind:chartProp="element.mapData"
        v-bind:elKey="index"
        v-bind:elHeight="480/maps.length"
        ref="chart"
        v-show="showChartElement"
      />
    </div>
  </div>
</template>

<script>
import choroplethMap from '@/components/charts/choroplethMap.vue'
import { DownloadIcon } from 'vue-feather-icons'
import { ImageIcon } from 'vue-feather-icons'
import { ListIcon } from 'vue-feather-icons'
import { BarChart2Icon } from 'vue-feather-icons'
import { InfoIcon } from 'vue-feather-icons'

export default {
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    choroplethMap, DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon
  },
  data() {
    return {
      componentKey: 0,
      maps: this.chartProp.maps,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: 'chart-info-modal-'+this.elKey,
      },
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    maps(val) {
      this.forceRerender();
    }
  },
  computed: {
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;  
    },
    exportImage() {
      for (let i = 0; i < this.$refs.chart.length; i += 1) {
        this.$refs.chart[i].$children[0].chart.exportChartLocal({ type: 'image/svg+xml' });
      }
    },
    exportCSV() {
      for (let i = 0; i < this.$refs.chart.length; i += 1) {
        this.$refs.chart[i].$children[0].chart.downloadCSV();
      }
    },
    showTable() {
      for (let i = 0; i < this.$refs.chart.length; i += 1) {
        this.$refs.chart[i].$children[0].chart.viewData();
      }
      this.$el.querySelector('.highcharts-data-table').childNodes[0].classList.add('table', 'table-bordered');
      this.$el.querySelector('.highcharts-data-table').style.display = 'block';
      this.showTableIcon = false;
      this.showChartIcon = true;
      this.showChartElement = false;
    },
    showChart() {
      this.showTableIcon = true;
      this.showChartIcon = false;
      this.showChartElement = true;
      this.$el.querySelector('.highcharts-data-table').style.display = 'none';
    },
  },
};
</script>

<style lang="scss">
</style>