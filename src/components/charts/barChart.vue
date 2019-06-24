<template>
  <div>
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
        chart: {
          type: 'column',
          height: this.chartProp.height,
          spacingBottom: 20,
          spacingTop: 20,
          spacingLeft: 10,
          spacingRight: 20,
        },
        title: false,
        xAxis: {
          type: this.chartProp.xAxisType,
          categories: this.chartProp.categoriesX
        },
        yAxis: {
          min: 0,
          title: {
            text: this.chartProp.yAxisText
          },
          labels: {
              // align: 'left',
              // x: 0,
          }
        },
        legend: {
            enabled: this.chartProp.legendEnabled
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
          shared: true
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              inside: true,
              align: 'center',
              verticalAlign: 'top',
              format: '{point.y}'
            },
          },
        },
        series: this.chartProp.series,
      }
    };
  },
  methods: {
    exportImage() {
      this.$refs.chart.chart.downloadSVG();
    },
    exportCSV() {
      this.$refs.chart.chart.downloadCSV();
    },
    showTable() {
      this.$refs.chart.chart.viewData();
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
