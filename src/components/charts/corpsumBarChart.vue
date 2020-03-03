<template>
  <div>
    <div class="vis-component-inner">
      <div class="head d-flex">
        <span class="vis-title">{{ chartProp.title }}</span>
        <div class="actions ml-auto">
        </div>
      </div>
      <div id="corpsum-bar-chart">
        <h1>{{ chartProp.title }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, min } from 'd3-array';
import { selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import * as d3 from 'd3';

export default {
  name: 'corpsumBarChart',
  props: {
    chartProp: Object,
    elKey: Number,
  },
  mounted() {
    // this.svgWidth = document.getElementById('container').offsetWidth * 0.75;
    this.svgWidth = 500;
    // this.AddResizeListener();
    this.initChart();
    this.AnimateLoad();
  },
  data: () => ({
    svgWidth: 0,
    redrawToggle: true,
    xKey: 'name',
    yKey: 'y',
  }),
  watch: {
    chartProp: {
      handler() {
        this.AnimateLoad();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initChart() {
      const svg = d3
        .select('#corpsum-bar-chart')
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .append('g')
        .attr('id', 'bars-group');
    },
    AnimateLoad() {
      const bars = d3.select('#bars-group').selectAll('.bar-positive').data(this.chartProp.series[0].data);

      bars
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        // .transition()
        // .delay((d, i) => i * 150)
        // .duration(1000)
        .attr('height', (d) => this.svgHeight - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth());

      bars
        .enter()
        .append('rect')
        .attr('class', 'bar-positive')
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        .transition()
        .delay((d, i) => i * 150)
        .duration(1000)
        .attr('height', (d) => this.svgHeight - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth());
    },
    AddResizeListener() {
      // redraw the chart 300ms after the window has been resized
      window.addEventListener('resize', () => {
        this.$data.redrawToggle = false;
        setTimeout(() => {
          this.$data.redrawToggle = true;
          this.$data.svgWidth = document.getElementById('container').offsetWidth * 0.75;
          this.AnimateLoad();
        }, 300);
      });
    },
  },
  computed: {
    dataMax() {
      return max(this.chartProp.series[0].data, (d) => d[this.yKey]);
    },
    dataMin() {
      return min(this.chartProp.series[0].data, (d) => d[this.yKey]);
    },
    xScale() {
      return scaleBand()
        .rangeRound([0, this.svgWidth])
        .padding(0.1)
        .domain(
          this.chartProp.series[0].data.map((d) => d[this.xKey]),
        );
    },
    yScale() {
      return scaleLinear()
        .rangeRound([this.svgHeight, 0])
        .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    },
    svgHeight() {
      return this.svgWidth / 1.61803398875; // golden ratio
    },
  },
};
</script>

<style>
.bar-positive {
  fill: steelblue;
  transition: r 0.2s ease-in-out;
}

.bar-positive:hover {
  fill: brown;
}

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 1%;
  vertical-align: top;
  overflow: hidden;
}
</style>
