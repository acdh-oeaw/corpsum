<template>
  <highcharts :constructor-type="'mapChart'" :options="chartOptions"></highcharts>
</template>

<script>

export default {
  props: {
    chartProp: Object,
    elKey: Number,
    elHeight: Number,
  },
  data () {
    return {
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
}

</script>
 <style scoped>
 </style>