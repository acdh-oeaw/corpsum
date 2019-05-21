<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import store from "@/store/store";

export default {
  store,
  data() {
    return {
      chartOptions: {
        chart: {
          polar: true,
          type: "line"
        },
        title: {
          text: "Dispersion Overview",
        },
        pane: {
          size: "80%"
        },
        xAxis: {
          categories: this.$store.getters.chartData.dispersion.categories,
          tickmarkPlacement: "on",
          lineWidth: 0
        },
        yAxis: {
          gridLineInterpolation: "polygon",
          lineWidth: 0,
          min: 0,
          max: 1
        },
        tooltip: {
          shared: true,
          pointFormat:
            '<span style="color:{series.color}">{series.name}: <b>{point.y:.2f}</b><br/>'
        },
        legend: {
          align: "right",
          verticalAlign: "middle"
        },
        series: this.$store.getters.chartData.dispersion.series,
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  align: "center",
                  verticalAlign: "bottom"
                },
                pane: {
                  size: "70%"
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
