<template>
  <div>
    <div class="vis-component-inner">
      <div class="head d-flex">
        <span class="vis-title">{{ chartProp.title }}</span>
        <div class="actions ml-auto">
        </div>
      </div>
      <div class="corpsum-bar-chart" ref="chart">
        <svg id="main-svg" v-if="redrawToggle === true" :width="svgWidth" :height="svgHeight">
          <g id="chart-group">
            <g id="gridlines-y" class="gridlines"></g>
            <g id="axis-x" class="axis"></g>
            <g id="axis-y" class="axis"></g>
            <g id="bars-group"></g>
          </g>
        </svg>
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
    console.log('chart mounted');
    // this.svgWidth = this.$refs.chart.clientWidth;
    // this.AddResizeListener();
    this.initChart();
    this.AnimateLoad();
    this.renderWordForms();
  },
  data: () => ({
    svgWidth: 0,
    svgHeight: 400,
    svgPadding: {
      top: 20, right: 20, bottom: 30, left: 40,
    },
    redrawToggle: true,
    xKey: 'name',
    yKey: 'y',
  }),
  watch: {
    'chartProp.series.0.data': {
      handler() {
        this.AnimateLoad();
      },
    },
    'chartProp.series.0.wordForms': {
      handler() {
        this.renderWordForms();
      },
    },
  },
  methods: {
    initChart() {
      const svg = d3
        .select('#main-svg');

      const chartGroup = d3
        .select('#chart-group')
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);

      const axisX = d3
        .select('#axis-x')
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`);

      const axisY = d3
        .select('#axis-y')
        .attr('class', 'axis')
        .attr('id', 'axis-y')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');
    },
    AnimateLoad() {
      if (this.$refs.chart) {
        this.svgWidth = this.$refs.chart.clientWidth;
      }

      const axisX = d3.select('#axis-x');
      const axisY = d3.select('#axis-y');

      axisX.call(d3.axisBottom(this.xScale));

      axisY.call(d3.axisLeft(this.yScale).ticks(10));

      const yGridlines = d3
        .select('#gridlines-y')
        .call(d3.axisLeft(this.yScale).ticks(5).tickSize(-this.svgWidth + this.svgPadding.left + this.svgPadding.right).tickFormat(''));

      // Define container groups for bars
      const barsGroup = d3.select('#bars-group');
      const bars = barsGroup.selectAll('.bar-block').data(this.chartProp.series[0].data);

      // Remove deleted ones
      bars
        .exit()
        .remove();

      // Update the size and position of existing ones
      bars
        .select('rect')
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth())
        .attr('fill', (d) => this.colors(d[this.xKey]));

      // Create bar-blocks for new data
      const newBars = bars
        .enter()
        .append('g')
        .attr('data-index', (d, i) => i)
        .attr('class', 'bar-block');

      // Create a new single bar for new data
      newBars
        .append('rect')
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth())
        .attr('fill', (d) => this.colors(d[this.xKey]));
    },
    renderWordForms() {

      // Define container groups for bars
      const barsGroup = d3.select('#bars-group');
      const bars = barsGroup.selectAll('.bar-block').data(this.chartProp.series[0].data);

      // Remove deleted ones
      bars
        .exit()
        .remove();

      const chartPropSeries = this.chartProp.series[0];

      const component = this;

      bars.each(function (dbar) {
        console.log(dbar)
        const bar = d3.select(this);
        const data = chartPropSeries.wordForms.filter((el) => el.query === dbar.name);

        bar
          .selectAll('.bar-piece')
          .attr('transform', (d, i) => {
            const xPos = component.xScale(dbar[component.xKey]);
            const barY = component.yScale(dbar[component.yKey]);
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            let thisHeight = barHeight / (dbar.absTotal / d.absValue);
            if (thisHeight < 20) thisHeight = 15;
            data[i].thisHeight = thisHeight;
            let yPos = barY;
            if (i === 0) {
              data[i].yEndPos = barY + thisHeight;
            } else {
              data[i].yEndPos = data[i - 1].yEndPos + thisHeight;
              yPos = data[i - 1].yEndPos;
            }
            return `translate(${xPos},${yPos})`;
          })
          .selectAll('rect')
          .attr('height', (d) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            return barHeight / (dbar.absTotal / d.absValue);
          })
          .attr('width', () => component.xScale.bandwidth())
          .attr('fill', () => component.colors(dbar[component.xKey]))
          .style('display', (d, i) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            const thisHeight = barHeight / (dbar.absTotal / d.absValue);
            if (thisHeight < 20) return 'none';
            return 'block';
          });

        // Remove deleted ones
        bar
          .selectAll('.bar-piece')
          .exit()
          .remove();

        const gS = bar
          .selectAll('.bar-piece')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'bar-piece')
          .attr('transform', (d, i) => {
            const xPos = component.xScale(dbar[component.xKey]);
            const barY = component.yScale(dbar[component.yKey]);
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            let thisHeight = barHeight / (dbar.absTotal / d.absValue);
            if (thisHeight < 20) thisHeight = 15;
            data[i].thisHeight = thisHeight;
            let yPos = barY;
            if (i === 0) {
              data[i].yEndPos = barY + thisHeight;
            } else {
              data[i].yEndPos = data[i - 1].yEndPos + thisHeight;
              yPos = data[i - 1].yEndPos;
            }
            return `translate(${xPos},${yPos})`;
          });

        const rects = gS
          .append('rect')
          .attr('height', (d) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            return barHeight / (dbar.absTotal / d.absValue);
          })
          .attr('width', () => component.xScale.bandwidth())
          .attr('fill', () => component.colors(dbar[component.xKey]))
          .style('display', (d, i) => {
            if (data[i].thisHeight < 20) return 'none';
            return 'block';
          });

        const texts = gS
          .append('text')
          .text((d) => d.word)
          .attr('fill', '#ffffff')
          .attr('x', 10)
          .attr('y', 20)
          .style('display', (d, i) => {
            //if (data[i].thisHeight < 20) return 'none';
            //return 'block';
          });


      });

      /*
      bars
        .selectAll('.bar-piece')
        .data(this.chartProp.series[0].wordForms)
        .enter()
        .append('rect')
        .attr('class', 'bar-piece')
        .attr('x', (d, i, j) => {
          const parentIndex = this.getObjectKey(this.chartProp.series[0].data, d.query, 'name');
          return this.xScale(this.chartProp.series[0].data[parentIndex][this.xKey]);
        })
        .attr('y', (d, i, j) => {
          const parentIndex = this.getObjectKey(this.chartProp.series[0].data, d.query, 'name');
          return this.yScale(this.chartProp.series[0].data[parentIndex][this.yKey]);
        })
        .attr('width', this.xScale.bandwidth())
        .attr('fill', (d, i, j) => {
          const parentIndex = this.getObjectKey(this.chartProp.series[0].data, d.query, 'name');
          return this.colors(this.chartProp.series[0].data[parentIndex][this.xKey]);
        })
        .text((d) => d.word);
*/
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
    getObjectKey(object, value, property) {
      if (property) return Object.keys(object).find((key) => object[key][property] === value);
      return Object.keys(object).find((key) => object[key] === value);
    },
  },
  computed: {
    colors() {
      return d3.scaleOrdinal(d3.schemeTableau10);
    },
    dataMax() {
      return max(this.chartProp.series[0].data, (d) => d[this.yKey]);
    },
    dataMin() {
      return min(this.chartProp.series[0].data, (d) => d[this.yKey]);
    },
    xScale() {
      return scaleBand()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right])
        .padding(0.1)
        .domain(
          this.chartProp.series[0].data.map((d) => d[this.xKey]),
        );
    },
    yScale() {
      return scaleLinear()
        .rangeRound([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
        .domain([this.dataMin > 0 ? 0 : this.dataMin, this.dataMax]);
    },
  },
};
</script>

<style>
.bar-block {
  /*fill: steelblue;*/
  /*transition: r 0.2s ease-in-out;*/
}

.bar-block:hover {
  /*fill: brown;*/
}

.bar-piece rect {
  stroke: white;
  stroke-width: 1px;
}

.gridlines line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.gridlines path {
  stroke-width: 0;
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
