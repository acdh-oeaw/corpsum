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
          type: 'bubble',
          plotBorderWidth: 1,
          zoomType: 'xy',
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
        series: this.chartProp.series
      }
    };
  }
};
</script>
