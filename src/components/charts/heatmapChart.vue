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
          type: 'heatmap',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1,
        },
        title: {
          text: 'Linguistic Regions',
        },
        xAxis: {
          categories: this.chartProp.categoriesX,
        },
        yAxis: {
          categories: this.chartProp.categoriesY,
          title: null,
        },
        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: this.Highcharts.getOptions().colors[4],
        },
        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280,
        },
        tooltip: {
          formatter() {
            return (
              `<b>${
                this.series.yAxis.categories[this.point.y]
              }</b> appears <br><b>${
                this.point.value
              }</b> % times often in <br><b>${
                this.series.xAxis.categories[this.point.x]
              }</b>`
            );
          },
        },
        series: [
          {
            name: 'Relative frequencies per linguistic region',
            borderWidth: 1,
            data: this.chartProp.data,
            dataLabels: {
              enabled: true,
              color: '#000000',
            },
          },
        ],
      },
    };
  },
};
</script>
