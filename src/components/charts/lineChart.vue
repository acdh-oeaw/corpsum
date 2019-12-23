<template>
  <highcharts :options="chartOptions" ref="chart" v-show="showChartElement"></highcharts>
</template>

<script>

export default {
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
          type: 'spline',
          zoomType: 'x',
          height: this.chartProp.height,
          spacingBottom: 20,
          spacingTop: 20,
          spacingLeft: 10,
          spacingRight: 20,
        },
        title: false,
        xAxis: {
          title: {
            text: this.chartProp.xAxisText,
          },
          allowDecimals: false,
          plotLines: this.chartProp.plotLinesX,
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText,
          },
          plotLines: this.chartProp.plotLinesY,
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'top',
          y: -15,
          margin: 5,
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            marker: {
              radius: 6,
            },
            dataLabels: {
              enabled: false,
              align: 'center',
              padding: 8,
              format: '{point.y} %',
            },
          },
          spline: {
            dataLabels: {
              // enabled: true
            },
            // enableMouseTracking: false
          },
        },
        series: this.chartProp.data,
        tooltip: {
          pointFormat: this.chartProp.pointFormat,
          shared: true,
        },
      },
    };
  },
};
</script>
