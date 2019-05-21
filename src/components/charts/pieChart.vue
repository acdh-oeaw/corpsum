<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
export default {
  props: {
    chartProp: Object
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "pie",
          height: this.chartProp.height,
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: this.chartProp.title
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 35,
            dataLabels: {
              enabled: true,
              format: "{point.name}"
            }
          }
        },
        series: [
          {
            type: "pie",
            name: "Browser share",
            data: this.chartProp.data
          }
        ]
      }
    };
  }
};
</script>
