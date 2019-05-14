<template>
  <highcharts :options="heatmapOptions"></highcharts>
</template>

<script>
import store from "@/store/store";

export default {
  store,
  data() {
    return {
      heatmapOptions: {
        chart: {
          type: "heatmap",
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
        },
        title: {
          text: "Linguistic Regions"
        },
        xAxis: {
          categories: this.$store.getters.chartData.regional.regions.categoriesX
        },
        yAxis: {
          categories: this.$store.getters.chartData.regional.regions.categoriesY,
          title: null
        },
        colorAxis: {
          min: 0,
          minColor: "#FFFFFF",
          maxColor: this.Highcharts.getOptions().colors[2]
        },
        legend: {
          align: "right",
          layout: "vertical",
          margin: 0,
          verticalAlign: "top",
          y: 25,
          symbolHeight: 280
        },
        tooltip: {
          formatter: function() {
            return (
              "<b>" +
              this.series.yAxis.categories[this.point.y] +
              "</b> appears <br><b>" +
              this.point.value +
              "</b> times in every 1 million words in <br><b>" +
              this.series.xAxis.categories[this.point.x] +
              "</b>"
            );
          }
        },
        series: [
          {
            name: "Relative frequencies per linguistic region",
            borderWidth: 1,
            data: this.$store.getters.chartData.regional.regions.data,
            dataLabels: {
              enabled: true,
              color: "#000000"
            }
          }
        ]
      }
    };
  }
};
</script>
