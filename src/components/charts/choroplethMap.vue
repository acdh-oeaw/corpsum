<template>
  <highcharts :constructor-type="'mapChart'" :options="chartOptions" class="map"></highcharts>
</template>

<script>

export default {
  props: {
    chartProp: Object,
  },
  data () {
    return {
      chartOptions: {
        chart: {
          map: 'geoJSONAustria',
          height: 175,
        },
        title: false,
        mapNavigation: {
          enabled: false,
        },
        legend: {
          title: {
              text: 'Word<br/><span style="font-size: 9px; color: #666; font-weight: normal">Relevative Frequency (%)</span>',
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
          max: this.chartProp.maxRelVal,
          minColor: "#FFFFFF",
          maxColor: this.Highcharts.getOptions().colors[4]
        },
        series: [{
          data: this.chartProp.data,
          keys: ['name', 'value'],
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
.map {
  /* min-height: 500px; */
}
 </style>