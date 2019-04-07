<template>
  <div id="map-chart">
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson';


export default {
  name: 'mapChart',
  data() {
    return {
      height: 500,
      width: '100%',
    };
  },
  mounted() {
    // Initial mounting
    // console.log('Component mounted');
    this.createChart();
  },
  /*
  computed: {
    displayChart() {
      // return this.createChart(this.dataLineChart);
      // this.createChart();
    },
  },
  */
  methods: {
    createChart() {
      const svg = d3.select('#map-chart').append('svg')
        .attr("width", this.width).attr("height", this.height);
      const path = d3.geoPath().projection(d3.geoMercator());

      d3.json('/world-110m.json')
        .then((world) => {
          svg.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path')
            .attr("id", function(d) { return d.id; })
            .attr("fill", function(d) { return '#'+d.id; })
            .attr('d', path);
        });

    },
  },
};
</script>
