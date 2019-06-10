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
          plotLines: [
            {
              color: 'blue',
              dashStyle: 'dot',
              width: 2,
              value: 118.68,
              label: {
                  rotation: 0,
                  y: 15,
                  style: {
                      fontStyle: 'italic'
                  },
                  text: 'Haus rel. freq.: 118.68'
              },
              zIndex: 3
            },
            {
              color: 'red',
              dashStyle: 'dot',
              width: 2,
              value: 42.90,
              label: {
                  rotation: 0,
                  y: 30,
                  style: {
                      fontStyle: 'italic'
                  },
                  text: 'Ball rel. freq.: 42.90'
              },
              zIndex: 3
            },
          ]
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText
          }
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
