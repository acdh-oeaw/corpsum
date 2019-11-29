<template>
  <div>
    <div class="vis-component-inner">
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>
        Relative
        <toggle-button v-model="frequencyValueTypeAbsolute" @change="onFrequencyValueTypeChange"/>
        Absolute
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
      <div :key="componentKey">
        <lineChart
          v-bind:chartProp="selectedChartData"
          ref="chart"
          v-show="showChartElement"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon,
} from 'vue-feather-icons';
import { ToggleButton } from 'vue-js-toggle-button';
import lineChart from '@/components/charts/lineChart.vue';

export default {
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    lineChart, DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon, ToggleButton,
  },
  data() {
    return {
      componentKey: 0,
      selectedChartData: this.chartProp.relative,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: `chart-info-modal-${this.elKey}`,
      },
      frequencyValueTypeAbsolute: false,
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    selectedChartData(val) {
      this.forceRerender();
    },
  },
  computed: {
  },
  methods: {
    onFrequencyValueTypeChange() {
      if (this.frequencyValueTypeAbsolute) {
        this.selectedChartData = this.chartProp.absolute;
      } else {
        this.selectedChartData = this.chartProp.relative;
      }
      this.forceRerender();
    },
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
      const tables = this.$el.querySelectorAll('.highcharts-data-table');
      for (let i = 0; i < tables.length; i += 1) {
        tables[i].childNodes[0].classList.add('table', 'table-sm', 'table-bordered');
        tables[i].style.display = 'block';
        tables[i].style.height = `${480 / this.maps.length}px`;
      }
      this.showTableIcon = false;
      this.showChartIcon = true;
      this.showChartElement = false;
    },
    showChart() {
      this.showTableIcon = true;
      this.showChartIcon = false;
      this.showChartElement = true;
      const tables = this.$el.querySelectorAll('.highcharts-data-table');
      for (let i = 0; i < tables.length; i += 1) {
        tables[i].style.display = 'none';
      }
    },
  },
};
</script>

<style lang="scss">
</style>
