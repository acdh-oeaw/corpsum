<template>
  <div>
    <div class="vis-component-inner">
      <div class="loading-spinner text-center" v-show="this.chartProp.loadingStatus">
        <span>This component is waiting for the data, please wait.</span>
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.mapTitle }}</span>

        <b-form-group class="head-buttons ml-auto">
          <b-form-radio-group
            v-model="valueType"
            :options="freqOptions"
            buttons
            button-variant="outline-primary"
            size="sm"
            name="radio-btn-outline"
            @change="onFrequencyValueTypeChange($event)"
          ></b-form-radio-group>
        </b-form-group>
        <div class="actions">
          <b-button variant="primary" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="primary" @click="showChart" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <bar-chart-2-icon></bar-chart-2-icon>
          </b-button>
          <b-button variant="primary" @click="exportCSV" v-b-tooltip.hover title="Export data as CSV">
            <download-icon></download-icon>
          </b-button>
          <b-button variant="primary" @click="exportImage" v-b-tooltip.hover title="Export image as SVG">
            <image-icon></image-icon>
          </b-button>
        </div>
      </div>
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.mapTitle" ok-only scrollable>{{this.chartProp.mapSubtitle}}</b-modal>
      <div :key="componentKey">
        <choroplethMap
          v-for="(element, index) in maps"
          v-bind:key="element.id"
          v-bind:chartProp="element.mapData"
          v-bind:elKey="index"
          v-bind:elHeight="360/maps.length"
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
import choroplethMap from '@/components/charts/choroplethMap.vue';

export default {
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    choroplethMap, DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon, ToggleButton,
  },
  data() {
    return {
      componentKey: 0,
      maps: this.chartProp.relativeMaps,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: `chart-info-modal-${this.elKey}`,
      },
      valueType: 'relative',
      freqOptions: [
        { text: 'Relative', value: 'relative' },
        { text: 'Absolute', value: 'absolute' },
      ],
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    maps(val) {
      this.forceRerender();
    },
  },
  computed: {
  },
  methods: {
    onFrequencyValueTypeChange(checked) {
      this.valueType = checked;
      if (checked === 'absolute') {
        this.maps = this.chartProp.absoluteMaps;
      } else {
        this.maps = this.chartProp.relativeMaps;
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
