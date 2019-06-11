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
          type: "scatter",
          zoomType: "xy"
        },
        title: {
          text: this.chartProp.title
        },
        subtitle: {
          text: this.chartProp.subitle
        },
        xAxis: {
          title: {
            enabled: true,
            text: this.chartProp.xAxisText
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          plotLines: this.chartProp.plotLinesX
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText
          },
          plotLines: this.chartProp.plotLinesY
        },
        plotOptions: {
          scatter: {
            dataLabels: {
              format: "{point.source}",
              enabled: true
            },
            marker: {
              radius: 7,
              states: {
                hover: {
                  enabled: true,
                  lineColor: "rgb(100,100,100)"
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
          }
        },
        tooltip: {
          pointFormat:
            '<span><b>{point.source}</b></span>: {point.x}, {point.y}<br/>',
          shared: true
        },
        series: this.chartProp.series,
      }
    };
  }
};
</script>
