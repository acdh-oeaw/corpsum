<template>
  <highcharts :options="lineOptions"></highcharts>
</template>

<script>

export default {
  props: {
    chartProp: Object,
  },
  data() {
    return {
      lineOptions: {
        chart: {
            zoomType: 'x',
            height: this.chartProp.height,
        },
        title: {
          text: this.chartProp.title
        },
        subtitle: {
          text: "Subtitle text extra information"
        },
        yAxis: {
          title: {
            text: this.chartProp.yAxisText
          }
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
