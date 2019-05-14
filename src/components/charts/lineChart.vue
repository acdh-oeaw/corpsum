<template>
  <highcharts :options="lineOptions"></highcharts>
</template>

<script>

export default {
  props: {
    lineData: Object,
  },
  data() {
    return {
      lineOptions: {
        chart: {
            zoomType: 'x'
        },
        title: {
          text: this.lineData.title
        },
        subtitle: {
          text: "Subtitle text extra information"
        },
        yAxis: {
          title: {
            text: this.lineData.yAxisText
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
        series: this.lineData.data,
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
