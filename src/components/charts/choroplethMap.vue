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
          spacingTop: 3,
          spacingRight: 10,
          spacingBottom: 3,
          spacingLeft: 100,
        },
        title: false,
        mapNavigation: {
          enabled: false,
        },
        legend: {
          title: {
              text: this.chartProp.queryTerm + '<br/><span style="font-size: 9px; color: #666; font-weight: normal">' + this.chartProp.valueTypeLabel + '</span>',
              style: {
                  fontStyle: 'italic'
              }
          },
          symbolWidth: 150,
          layout: 'horizontal',
          verticalAlign: 'top',
          align: 'left',
          floating: true,
          x: -100
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
          name: this.chartProp.valueTypeLabel,
          states: {
            hover: {
              color: '#a4edba'
            }
          },
          borderWidth: 1,
          dataLabels: {
            enabled: true,
            format: '{point.properties.name}'
          },
          events: {
            click: ({ point }) => {
              const regionName = point.name;
              const regionQuery = point.query;
              this.bus.$emit('onRegionClick', { regionName, regionQuery });
            },
          },
        }],
        tooltip: {
          pointFormat:
            '<span>{point.name}</span>: <b>{point.value}' + this.chartProp.valueTypeUnit + '</b><br/>',
          shared: true
        },
      }
    }
  },
}

</script>
 <style scoped>
 </style>