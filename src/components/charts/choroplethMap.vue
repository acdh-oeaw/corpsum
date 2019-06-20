<template>
  <highcharts :constructor-type="'mapChart'" :options="chartOptions" class="map"></highcharts>
</template>

<script>

export default {
  data () {
    return {
      chartOptions: {
        chart: {
          map: 'geoJSONAustria'
        },
        title: {
          text: 'GeoJSON in Highmaps'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        colorAxis: {
          tickPixelInterval: 100
        },
        series: [{
          data: [
            ['AT-West', 100],
            ['AT-Mitte', 222],
            ['AT-Sudost', 333],
            ['AT-Ost', 444],
          ],
          keys: ['name', 'value'],
          joinBy: 'name',
          name: 'Relative Frequency (%)',
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.properties.name}'
          }
        }]
      }
    }
  }
}
</script>
 <style scoped>
.map {
  min-height: 500px;
}
 </style>