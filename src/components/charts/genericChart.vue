<template>
  <div>
    <select class="custom-select custom-select-sm chart-type-selector col-2" v-model="chartType" @change="changeChartType($event)">
      <option value="column">Column</option>
      <option value="bar" selected>Bar</option>
      <option value="line">Line</option>
      <option value="area">Area</option>
      <option value="scatter">Scatter</option>
      <option value="bubble">Bubble</option>
      <option value="heatmap">Heatmap</option>
    </select>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
export default {
  props: {
    chartProp: Object
  },
  data() {
    return {
      chartType: 'bar',
      chartOptions: {
        chart: {
          type: this.chartProp.type,
          height: this.chartProp.height,
          plotBorderWidth: 1,
          zoomType: 'xy'
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
        series: this.chartProp.series1D
      }
    };
  },
  methods: {
    changeChartType(event) {
      this.chartOptions.chart.type = this.chartType;
      if (this.chartType === 'bubble') {
        this.chartOptions.series = this.chartProp.series2D;
      } else {
        this.chartOptions.series = this.chartProp.series1D;
      }
    },
  },
};
</script>

<style lang="scss">
.chart-type-selector {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
}
</style>
