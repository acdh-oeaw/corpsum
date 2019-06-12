<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>

export default {
  props: {
    chartProp: Object,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'spline',
          zoomType: 'x',
          height: this.chartProp.height,
        },
        title: {
          text: this.chartProp.title
        },
        subtitle: {
          text: this.chartProp.subtitle
        },
        xAxis: {
          title: {
            text: this.chartProp.xAxisText
          },
          allowDecimals: false,
          plotLines: this.chartProp.plotLinesX
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText
          },
          plotLines: this.chartProp.plotLinesY
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle"
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            }
          },
          spline: {
            dataLabels: {
              // enabled: true
            },
            // enableMouseTracking: false
          }
        },
        series: this.chartProp.data,
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      }
    };
  }
};
</script>
