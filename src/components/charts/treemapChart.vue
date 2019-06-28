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
      <highcharts :options="chartOptions" ref="chart" v-show="showChartElement"></highcharts>
    </div>
  </div>
</template>

<script>
import { DownloadIcon } from 'vue-feather-icons'
import { ImageIcon } from 'vue-feather-icons'
import { ListIcon } from 'vue-feather-icons'
import { BarChart2Icon } from 'vue-feather-icons'
import { InfoIcon } from 'vue-feather-icons'

export default {
  components: {
    DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon
  },
  props: {
    chartProp: Object,
    elKey: Number,
  },
  data() {
    return {
      componentKey: 0,
      seriesData: this.chartProp.data,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: 'chart-info-modal-'+this.elKey,
      },
      chartOptions: {
        exporting: {
          enabled: false,
        },
        title: false,
        plotOptions: {
          treemap: {
            dataLabels: {
              enabled: true,
              inside: true,
              align: 'center',
              verticalAlign: 'middle',
              format: '<span style="text-align:center;">{point.name}:<br/>{point.value}</span>'
            },
          },
        },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          alternateStartingDirection: true,
          allowDrillToNode: true,
          animationLimit: 1000,
          dataLabels: {
            enabled: false
          },
          levelIsConstant: false,
          levels: [{
            level: 1,
            dataLabels: {
              enabled: true
            },
            borderWidth: 3
          }],
          data: this.chartProp.data,
        }],
      }
    };
  },
  methods: {
    exportImage() {
      this.$refs.chart.chart.exportChartLocal({ type: 'image/svg+xml' });
    },
    exportCSV() {
      this.$refs.chart.chart.downloadCSV();
    },
    showTable() {
      this.$refs.chart.chart.viewData();
      this.$el.querySelector('.highcharts-data-table').childNodes[0].classList.add('table', 'table-sm', 'table-bordered');
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
    forceRerender() {
      this.componentKey += 1;  
    },
  },
  watch: {
    seriesData(val) {
      this.forceRerender();
    }
  },
};
</script>

<style lang="scss">
</style>
