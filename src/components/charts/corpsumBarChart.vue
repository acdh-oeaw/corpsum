<template>
  <div>
    <div class="vis-component-inner">
      <div class="loading-spinner text-center" v-show="this.chartProp.loadingStatus">
        <span>This component is waiting for the data, please wait.</span>
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>

        <b-form-group class="head-buttons ml-auto mr-2">
          <b-button
            :pressed.sync="showWordForms"
            variant="outline-primary"
            size="sm"
            @click="onWordFormToggle()"
          >
            Word Forms
          </b-button>
        </b-form-group>

        <b-form-group class="head-buttons">
          <b-form-radio-group
            v-model="valueType"
            :options="freqOptions"
            buttons
            button-variant="outline-primary"
            size="sm"
            name="radio-btn-outline"
            @change="onFrequencyValueTypeChange($event)"
          ></b-form-radio-group>
        </b-form-group>

        <!-- Relative
        <toggle-button v-model="frequencyValueTypeAbsolute" @change="onFrequencyValueTypeChange"/>
        Absolute -->
        <div class="actions">
<!--           <b-button variant="primary" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="primary" @click="showChart" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <bar-chart-2-icon></bar-chart-2-icon>
          </b-button>
          <b-button variant="primary" @click="exportCSV" v-b-tooltip.hover title="Export data as CSV">
            <download-icon></download-icon>
          </b-button> -->
          <b-button variant="primary" @click="exportImage" v-b-tooltip.hover title="Export image as SVG">
            <image-icon></image-icon>
          </b-button>
        </div>
      </div>
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.title" ok-only scrollable>{{this.chartProp.subtitle}}</b-modal>
      <div class="corpsum-chart corpsum-bar-chart" ref="chart" :key="componentKey">
        <svg id="main-svg" v-if="redrawToggle === true" :width="svgWidth" :height="svgHeight">
          <g id="chart-group">
            <g id="gridlines-y" class="gridlines"></g>
            <g id="axis-x" class="axis"></g>
            <g id="axis-y" class="axis"></g>
            <g id="bars-group"></g>
          </g>
        </svg>
        <b-button variant="outline-primary" class="go-to-upper-chart-btn chart-btn-sm" v-show="activeDrilldownQuery" @click="goToUpperChart" size="sm">
          <corner-up-left-icon></corner-up-left-icon>
          Go Back
        </b-button>

      </div>
    </div>
  </div>
</template>

<script>
import {
  DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon, CornerUpLeftIcon
} from 'vue-feather-icons';
import { ToggleButton } from 'vue-js-toggle-button';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, min } from 'd3-array';
import { selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import * as d3 from 'd3';

const d3ToPng = require('d3-svg-to-png');

export default {
  name: 'corpsumBarChart',
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon, ToggleButton, CornerUpLeftIcon
  },
  mounted() {
    // this.svgWidth = document.getElementById('container').offsetWidth * 0.75;
    console.log('chart mounted');
    // this.svgWidth = this.$refs.chart.clientWidth;
    this.AddResizeListener();
    this.initChart();
    this.AnimateLoad();
    this.renderWordForms();
  },
  data() {
    return {
      svgWidth: 0,
      svgHeight: 0,
      svgPadding: {
        top: 25, right: 20, bottom: 30, left: 40,
      },
      redrawToggle: true,
      xKey: 'name',
      yKey: 'relValue',
      valueType: 'relValue',
      componentKey: 0,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: `chart-info-modal-${this.elKey}`,
      },
      freqOptions: [
        { text: 'Relative', value: 'relValue' },
        { text: 'Absolute', value: 'absValue' },
      ],
      showWordForms: true,
      activeDrilldownQuery: false,
      activeDrilldownData: [],
      activeDrilldownParentIndex: 0,
    };
  },
  watch: {
    'chartProp.series': {
      handler() {
        this.initChart();
        this.AnimateLoad();
        this.renderWordForms();
      },
      deep: true,
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
        this.svgHeight = this.$refs.chart.clientHeight;
      }

      const axisX = d3.select('#axis-x');
      const axisY = d3.select('#axis-y');

      axisX.call(d3.axisBottom(this.xScale));

      axisY.call(d3.axisLeft(this.yScale).ticks(10)
        .tickFormat((d) => {
          if (d > 1000) { return d3.format('.2s')(d); }
          if (d > 10) { return d3.format('d')(d); }
          return d3.format('.2f')(d);
        }));

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
        //.attr('fill', (d) => this.colors(d[this.xKey]));
        .attr('class', (d, i) => `bg-series-color-${i}`);

      // Create bar-blocks for new data
      const newBars = bars
        .enter()
        .append('g')
        .attr('data-index', (d, i) => i)
        .attr('class', 'bar-block')
        .on('click', this.handleBarClick)
        .on('mouseover', this.handleMouseOver)
        .on('mouseout', this.handleMouseOut);

      // Create a new single bar for new data
      newBars
        .append('rect')
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth())
        //.attr('fill', (d) => this.colors(d[this.xKey]));
        .attr('class', (d, i) => `bg-series-color-${i}`);
    },
    renderWordForms() {
      // Define container groups for bars
      const barsGroup = d3.select('#bars-group');
      const bars = barsGroup.selectAll('.bar-block').data(this.chartProp.series[0].data);

      const chartPropSeries = this.chartProp.series[0];

      const component = this;

      bars.each(function (dbar) {
        const bar = d3.select(this);

        const data = chartPropSeries.wordForms.filter((el) => el.query === dbar.name);

        bar
          .selectAll('.word-forms-group')
          .remove();

        const wordFormsGroup = bar
          .append('g')
          .attr('class', 'word-forms-group');

        wordFormsGroup
          .selectAll('.bar-piece')
          .attr('transform', (d, i) => {
            const xPos = component.xScale(dbar[component.xKey]);
            const barY = component.yScale(dbar[component.yKey]);
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            let thisHeight = barHeight / (dbar[component.yKey] / d[component.valueType]);
            if (thisHeight < 22) thisHeight = 15;
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
          .style('display', (d, i) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            const barY = component.yScale(dbar[component.yKey]);
            if (i !== 0 && data[i].yEndPos - barY > barHeight - 10) return 'none';
            return 'block';
          })
          .selectAll('rect')
          .attr('height', (d) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            return barHeight / (dbar[component.yKey] / d[component.valueType]);
          })
          .attr('width', () => component.xScale.bandwidth())
          .attr('fill', 'none')
          .style('display', (d, i) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            const thisHeight = barHeight / (dbar[component.yKey] / d[component.valueType]);
            if (thisHeight < 22) return 'none';
            return 'block';
          });

        const gS = wordFormsGroup
          .selectAll('.bar-piece')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'bar-piece')
          .attr('transform', (d, i) => {
            const xPos = component.xScale(dbar[component.xKey]);
            const barY = component.yScale(dbar[component.yKey]);
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            let thisHeight = barHeight / (dbar[component.yKey] / d[component.valueType]);
            if (thisHeight < 22) thisHeight = 15;
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
          .style('display', (d, i) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            const barY = component.yScale(dbar[component.yKey]);
            if (i !== 0 && data[i].yEndPos - barY > barHeight - 10) return 'none';
            return 'block';
          });

        const rects = gS
          .append('rect')
          .attr('height', (d) => {
            const barHeight = component.svgHeight - component.svgPadding.top - component.svgPadding.bottom - component.yScale(dbar[component.yKey]);
            return barHeight / (dbar[component.yKey] / d[component.valueType]);
          })
          .attr('width', () => component.xScale.bandwidth())
          .attr('fill', () => 'none')
          .style('display', (d, i) => {
            if (data[i].thisHeight < 22) return 'none';
            return 'block';
          });

        const texts = gS
          .append('text')
          .text((d) => d.name)
          .attr('fill', '#ffffff')
          .attr('x', 5)
          .attr('y', 18)
          .style('display', (d, i) => {
            // if (data[i].thisHeight < 20) return 'none';
            // return 'block';
          });

        const textsVal = gS
          .append('text')
          .text((d) => d[component.valueType])
          .attr('fill', '#ffffff')
          .attr('x', () => component.xScale.bandwidth() - 5)
          .attr('y', 18)
          .attr('text-anchor', 'end');

        d3.selectAll('.bar-hover-text').remove();
      });

      this.onWordFormToggle();

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
        //this.$data.redrawToggle = false;
        setTimeout(() => {
          //this.$data.redrawToggle = true;
          this.initChart();
          this.AnimateLoad();
          this.renderWordForms();
        }, 300);
      });
    },
    getObjectKey(object, value, property) {
      if (property) return Object.keys(object).find((key) => object[key][property] === value);
      return Object.keys(object).find((key) => object[key] === value);
    },
    handleMouseOver(d, i) {
      d3.select('#main-svg')
        .append('text')
        .text(() => {
          if (this.activeDrilldownQuery) {
            return d3.format('d')(d[this.yKey]);
          } return d[this.yKey];
        })
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff')
        .attr('class', 'bar-hover-text')
        .attr('id', `t${this.xScale(d[this.xKey])}-${this.yScale(d[this.yKey])}-${i}`)
        .attr('x', () => this.xScale(d[this.xKey]) + this.xScale.bandwidth() + 35)
        .attr('y', () => this.yScale(d[this.yKey]) + 20)
        .transition()
        .duration(150)
        .ease(d3.easeLinear)
        .attr('fill', '#000000');

      let lineName = d.name;
      if (d.query) lineName = `[word="${d.name}"]`;
      this.bus.$emit('onBarHover', { name: lineName, flag: true });
    },
    handleMouseOut(d, i) {
      d3.select(`#t${this.xScale(d[this.xKey])}-${this.yScale(d[this.yKey])}-${i}`).remove();
      let lineName = d.name;
      if (d.query) lineName = `[word="${d.name}"]`;
      this.bus.$emit('onBarHover', { name: lineName, flag: false });
    },
    handleBarClick(d, i) {
      const barsData = this.chartProp.series[0].wordForms.filter((el) => el.query === d.name).slice(0, 15);
      if (barsData) {
        this.activeDrilldownQuery = d.name;
        this.activeDrilldownData = barsData;
        this.activeDrilldownParentIndex = i;
        this.createBars(barsData, i);
        //this.$store.commit('queryTermAdded', val.tag);
        console.log(barsData);
        this.bus.$emit('onDrilldownClick', { barsData, i });
      }
    },
    goToUpperChart() {
      const barsGroup = d3.select('#bars-group');
      barsGroup.selectAll('.bar-block').remove();
      this.activeDrilldownQuery = false;
      this.svgPadding.bottom = 30;
      this.initChart();
      this.AnimateLoad();
      this.renderWordForms();
      this.bus.$emit('onDrilldownGoBack');
    },
    createBars(barsData, parentIndex) {
      const axisX = d3.select('#axis-x');
      const axisY = d3.select('#axis-y');

      const axisBottom = axisX.call(d3.axisBottom(this.xScale))
        .selectAll('text')
        .attr('y', 7)
        .attr('x', -6)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      if (axisX.node().getBBox().height > 25) {
        this.svgPadding.bottom = 5 + axisX.node().getBBox().height;
        this.initChart();
      }

      axisY.call(d3.axisLeft(this.yScale).ticks(10)
        .tickFormat((d) => {
          if (d > 1000) { return d3.format('.2s')(d); }
          if (d > 10) { return d3.format('d')(d); }
          return d3.format('.2f')(d);
        }));

      const yGridlines = d3
        .select('#gridlines-y')
        .call(d3.axisLeft(this.yScale).ticks(5).tickSize(-this.svgWidth + this.svgPadding.left + this.svgPadding.right).tickFormat(''));

      console.log(barsData);

      // Define container groups for bars
      const barsGroup = d3.select('#bars-group');

      // for drill down
      barsGroup.selectAll('.bar-block').remove();

      const bars = barsGroup.selectAll('.bar-block').data(barsData);

      // Remove deleted ones
      /* bars
        .exit()
        .remove(); */

      // Create bar-blocks for new data
      const newBars = bars
        .enter()
        .append('g')
        .attr('data-index', (d, i) => i)
        .attr('class', 'bar-block')
        // .on('click', this.handleBarClick)
        .on('mouseover', this.handleMouseOver)
        .on('mouseout', this.handleMouseOut);

      // Create a new single bar for new data
      newBars
        .append('rect')
        .attr('x', (d) => this.xScale(d[this.xKey]))
        .attr('y', (d) => this.yScale(d[this.yKey]))
        .attr('height', (d) => this.svgHeight - this.svgPadding.top - this.svgPadding.bottom - this.yScale(d[this.yKey]))
        .attr('width', this.xScale.bandwidth())
        .attr('fill', (d, i) => this.shadeColor(this.$chartColors[parentIndex], (i * 100 + 1) / (barsData.length + 5)));

      // Add labels on top of new bars
      /*
      newBars
        .append('text')
        .text((d) => d.name)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .attr('class', 'bar-top-label-text')
        .attr('x', (d) => this.xScale(d[this.xKey]) + this.xScale.bandwidth() - 15)
        .attr('y', (d) => this.yScale(d[this.yKey]) - 5)
        .attr('transform', (d) => {
          const cx = this.xScale(d[this.xKey]) + this.xScale.bandwidth() - 15;
          const cy = this.yScale(d[this.yKey]) - 5;
          return `rotate(-45,${cx},${cy})`;
        });*/
      d3.selectAll('.bar-hover-text').remove();
    },
    shadeColor(baseColor, change) {
      return `#${ baseColor.replace(/^#/, '').replace(/../g, baseColor => (`0${Math.min(255, Math.max(0, parseInt(baseColor, 16) + Math.round(change))).toString(16)}`).substr(-2))}`;
    },
    onFrequencyValueTypeChange(checked) {
      if (checked === 'absValue') {
        this.valueType = 'absValue';
        this.yKey = 'absValue';
      } else if (checked === 'relValue') {
        this.valueType = 'relValue';
        this.yKey = 'relValue';
      }
      if (this.activeDrilldownQuery) {
        this.createBars(this.activeDrilldownData, this.activeDrilldownParentIndex);
      } else {
        this.AnimateLoad();
        this.renderWordForms();
      }
    },
    onWordFormToggle() {
      if (this.showWordForms === false) {
        d3.selectAll('.word-forms-group')
          .style('display', 'none');
      } else {
        d3.selectAll('.word-forms-group')
          .style('display', 'block');
      }
    },
    forceRerender() {
      this.componentKey += 1;
    },
    exportImage() {
      //this.$refs.chart.$children[0].chart.exportChartLocal({ type: 'image/svg+xml' });
      d3ToPng('.corpsum-bar-chart > #main-svg', 'chart', {
        scale: 3,
        quality: 0.01,
      });
    },
    exportCSV() {
      this.$refs.chart.$children[0].chart.downloadCSV();
    },
    showTable() {
      this.$refs.chart.$children[0].chart.viewData();
      this.$el.querySelector('.highcharts-data-table').childNodes[0].classList.add('table', 'table-sm', 'table-bordered');
      this.$el.querySelector('.highcharts-data-table').style.display = 'block';
      this.showTableIcon = false;
      this.showChartIcon = true;
      this.showChartElement = false;
    },
    showChart() {
      this.showTableIcon = true;
      this.showChartIcon = false;
      this.showChartElement = true;
      const tables = this.$el.querySelectorAll('.highcharts-data-table');
      for (let i = 0; i < tables.length; i += 1) {
        tables[i].style.display = 'none';
      }
    },
  },
  computed: {
    colors() {
      return d3.scaleOrdinal(d3.schemeTableau10);
    },
    dataMax() {
      let domainData = this.chartProp.series[0].data;
      if (this.activeDrilldownQuery) {
        domainData = this.chartProp.series[0].wordForms.filter((el) => el.query === this.activeDrilldownQuery).slice(0, 15);
      }
      return max(domainData, (d) => d[this.yKey]);
    },
    dataMin() {
      let domainData = this.chartProp.series[0].data;
      if (this.activeDrilldownQuery) {
        domainData = this.chartProp.series[0].wordForms.filter((el) => el.query === this.activeDrilldownQuery).slice(0, 15);
      }
      return min(domainData, (d) => d[this.yKey]);
    },
    xScale() {
      let domainData = this.chartProp.series[0].data;
      if (this.activeDrilldownQuery) {
        domainData = this.chartProp.series[0].wordForms.filter((el) => el.query === this.activeDrilldownQuery).slice(0, 15);
      }
      return scaleBand()
        .rangeRound([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right])
        .padding(0.1)
        .domain(
          domainData.map((d) => d[this.xKey]),
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

<style lang="scss">
.head-buttons {
  margin-bottom: 0;

  .btn-sm, .btn-group-sm > .btn {
    padding: 0.15rem 0.4rem;
    font-size: 0.8rem;
  }

  .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus, .show > .btn-outline-primary.dropdown-toggle:focus, .btn-outline-primary:focus, .btn-outline-primary.focus {
    box-shadow: none;
  }

  .btn-group:focus {
    outline: none;
  }

}

.chart-btn-sm {
  padding: 0.15rem 0.4rem;
  font-size: 0.8rem;
}

.bar-block {
  transition: opacity 0.15s ease-in-out;
  cursor: pointer;
}

.bar-block:hover {
  opacity: 0.92;
}

.bar-piece rect {
  stroke: white;
  stroke-width: 1px;
}

.bar-top-label-text, .bar-hover-text, .bar-piece > text {
  font-size: 0.70rem;
}

.go-to-upper-chart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding-bottom: 0.1rem !important;
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
