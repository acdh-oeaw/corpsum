<template>
  <div>
    <div class="vis-component-inner">
      <div class="head d-flex">
        <span class="vis-title">{{ chartProp.title }}</span>
        <div class="actions ml-auto">
          <b-button variant="info" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="info" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <list-icon @click="showChart"></list-icon>
          </b-button>
          <b-button variant="info" v-b-tooltip.hover title="Export data as CSV">
            <download-icon @click="exportCSV"></download-icon>
          </b-button>
          <b-button variant="info" v-b-tooltip.hover title="Export image as PNG">
            <image-icon @click="exportImage"></image-icon>
          </b-button>
        </div>
      </div>
      <highcharts :options="chartOptions" ref="chart" v-show="showChartElement"></highcharts>
    </div>
  </div>
</template>

<script>
import { DownloadIcon } from 'vue-feather-icons'
import { ImageIcon } from 'vue-feather-icons'
import { ListIcon } from 'vue-feather-icons'

export default {
  components: {
    DownloadIcon, ImageIcon, ListIcon
  },
  props: {
    chartProp: Object
  },
  data() {
    return {
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartOptions: {
        chart: {
          type: 'column',
          height: this.chartProp.height
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
          },
        },
        series: this.chartProp.series,
        exporting: {
          // enabled: false,
        },
      }
    };
  },
  methods: {
    exportImage() {
      this.$refs.chart.chart.exportChartLocal({
        type: 'image/png'
      });
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
.actions {
  button {
    padding: 0 0.25rem;
    margin-left: 0.5rem;
  }
}
</style>
