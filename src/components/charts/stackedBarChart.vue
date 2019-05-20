<template>
  <highcharts :options="stackedBarOptions"></highcharts>
</template>

<script>
export default {
  props: {
    chartProp: Object
  },
  data() {
    return {
      stackedBarOptions: {
        chart: {
          type: this.chartProp.type,
          height: this.chartProp.height,
        },
        title: {
          text: this.chartProp.title
        },
        xAxis: {
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
            stacking: this.chartProp.stacking
          },
          bar: {
            stacking: this.chartProp.stacking
          }
        },
        series: this.chartProp.series
      }
    };
  }
};
</script>
