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
          type: 'column',
        },
        title: {
          text: this.chartProp.title
        },
        xAxis: {
          type: this.chartProp.xAxisType,
          categories: this.chartProp.categories
        },
        yAxis: {
          min: 0,
          title: {
            text: this.chartProp.yAxisText
          }
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
          },
        },
        series: this.chartProp.series
      }
    };
  }
};
</script>
