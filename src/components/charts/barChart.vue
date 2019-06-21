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
          height: this.chartProp.height
        },
        title: {
          text: this.chartProp.title
        },
        subtitle: {
          text: this.chartProp.subtitle
        },
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
        series: this.chartProp.series
      }
    };
  }
};
</script>
