<template>
  <div class="multi-map-child">
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
      <highcharts :constructor-type="'mapChart'" :options="chartOptions" ref="chart" v-show="showChartElement"></highcharts>
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
  props: {
    chartProp: Object,
    elKey: Number,
    elHeight: Number,
  },
  components: {
    DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon
  },
  data () {
    return {
      componentKey: 0,
      maps: this.chartProp.maps,
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
          map: 'geoJSONAustria',
          height: this.elHeight,
        },
        title: false,
        mapNavigation: {
          enabled: false,
        },
        legend: {
          title: {
              text: this.chartProp.queryTerm + '<br/><span style="font-size: 9px; color: #666; font-weight: normal">Relevative Frequency (%)</span>',
              style: {
                  fontStyle: 'italic'
              }
          },
          layout: 'horizontal',
          verticalAlign: 'top',
          align: 'left',
          floating: true,
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: this.Highcharts.getOptions().colors[this.elKey]
        },
        series: [{
          data: this.chartProp.data,
          keys: ['query', 'name', 'value'],
          joinBy: 'name',
          name: 'Relative Frequency (%)',
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          borderWidth: 1,
          dataLabels: {
            enabled: true,
            format: '{point.properties.name}'
          }
        }]
      }
    }
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
}

</script>
 <style scoped>
 </style>