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
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.title" ok-only scrollable>
        <p v-html="this.chartProp.subtitle"></p>
      </b-modal>
      <highcharts :options="chartOptions" ref="chart" v-show="showChartElement"></highcharts>
    </div>
  </div>
</template>

<script>
import {
  DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon,
} from 'vue-feather-icons';


export default {
  components: {
    DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon,
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
        id: `chart-info-modal-${this.elKey}`,
      },
      chartOptions: {
        exporting: {
          enabled: false,
        },
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          spacingBottom: 20,
          spacingTop: 20,
          spacingLeft: 10,
          spacingRight: 20,
          height: this.chartProp.height,
        },
        title: false,
        xAxis: {
          min: 0,
          title: {
            enabled: true,
            text: this.chartProp.xAxisText,
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          plotLines: this.chartProp.plotLinesX,
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText,
          },
          plotLines: this.chartProp.plotLinesY,
        },
        legend: {
          enabled: this.chartProp.legendEnabled,
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'top',
          y: -15,
          margin: 15,
        },
        plotOptions: {
          scatter: {
            dataLabels: {
              format: '{series.name}',
              enabled: true,
            },
            marker: {
              symbol: 'circle',
              radius: 4,
              fillOpacity: 0.3,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)',
                },
              },
            },
            states: {
              hover: {
                marker: {
                  enabled: false,
                },
              },
            },
          },
        },
        tooltip: {
          pointFormat:
            '<span><b>{point.source}</b></span>: {point.x}, {point.y}<br/>',
          shared: true,
        },
        series: this.chartProp.series,
      },
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
  },
};
</script>
