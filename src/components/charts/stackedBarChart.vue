<template>
  <highcharts :options="stackedBarOptions"></highcharts>
</template>

<script>
import store from '@/store/store';

export default {
  store,
  data () {
    return {
      stackedBarOptions: {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Narrative Forms'
        },
        xAxis: {
            categories: this.$store.getters.chartData.narrative.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Percentage of Absolute Frequencies'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series: this.$store.getters.chartData.narrative.series
      }
    }
  }
}
</script>
