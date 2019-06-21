<template>
  <highcharts :class="`col-md-${elWidth} vis-component`" :options="chartOptions"></highcharts>
</template>

<script>
export default {
  props: {
    chartProp: Object,
    elKey: Number,
    elWidth: Number,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: this.chartProp.height
        },
        title: {
          text: this.chartProp.title
        },
        subtitle: {
          text: this.chartProp.subtitle
        },
        series: [{
          type: 'wordcloud',
          data: this.chartProp.data,
          colors: [this.Highcharts.getOptions().colors[this.elKey]],
          name: 'logDice Score',
          rotation: {
            from: 0,
            to: 0,
            orientations: 1,
          },
          spiral: 'square',
          placementStrategy: 'center',
        }],
        legend: {
            enabled: this.chartProp.legendEnabled
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
          shared: true
        },
      }
    };
  }
};
</script>
