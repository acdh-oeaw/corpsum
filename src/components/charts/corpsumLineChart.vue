<template>
  <div>
    <div class="vis-component-inner">
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>
        <b-form-group class="head-buttons ml-auto">
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
        <div class="actions">
          <b-button variant="info" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="info" @click="showChart" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <bar-chart-2-icon></bar-chart-2-icon>
          </b-button>
          <b-button variant="info" @click="exportCSV" v-b-tooltip.hover title="Export data as CSV">
            <download-icon></download-icon>
          </b-button>
          <b-button variant="info" @click="exportImage" v-b-tooltip.hover title="Export image as SVG">
            <image-icon></image-icon>
          </b-button>
        </div>
      </div>
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.title" ok-only scrollable>{{this.chartProp.subtitle}}</b-modal>
      <div class="corpsum-line-chart corpsum-chart" ref="chart" :key="componentKey">
        <svg class="main-svg" :width="svgWidth" :height="svgHeight">
          <g class="chart-group" ref="chartGroup">
            <g class="focus-group" ref="focusGroup">
              <g class="axis axis-x" ref="axisX"></g>
              <g class="axis axis-y" ref="axisY"></g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon
} from 'vue-feather-icons';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, min } from 'd3-array';
import { selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import * as d3 from 'd3';

export default {
  name: 'corpsumLineChart',
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon,
  },
  mounted() {
    console.log('chart mounted');
    this.drawChart();
  },
  data() {
    return {
      svgWidth: 0,
      svgHeight: 325,
      svgPadding: {
        top: 25, right: 20, bottom: 30, left: 40,
      },
      xKey: 'year',
      yKey: 'value',
      valueType: 'relative',
      componentKey: 0,
      showTableIcon: true,
      showChartIcon: false,
      showChartElement: true,
      chartInfoModal: {
        id: `chart-info-modal-${this.elKey}`,
      },
      freqOptions: [
        { text: 'Relative', value: 'relative' },
        { text: 'Absolute', value: 'absolute' },
      ],
      showWordForms: true,
    };
  },
  watch: {
    chartProp: {
      handler() {
        this.drawChart();
      },
      deep: true,
    },
  },
  methods: {
    drawChart() {
      if (this.$refs.chart) this.svgWidth = this.$refs.chart.clientWidth;
      d3.select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
      this.drawXAxis();
      this.drawYAxis();
      this.drawLines();
    },
    drawXAxis() {
      d3.select(this.$refs.axisX)
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`)
        .call(d3.axisBottom(this.xScale));
    },
    drawYAxis() {
      d3.select(this.$refs.axisY)
        .call(d3.axisLeft(this.yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');
    },
    drawLines() {
      const focusGroup = d3.select(this.$refs.focusGroup);
      // Remove previous paths to redraw
      focusGroup.selectAll('path').remove();
      // Add the valueline path.
      const valueline = d3.line()
        .x((d) => this.xScale(d.year))
        .y((d) => this.yScale(d.value));
      // Draw the line for each set of data
      for (let i = 0; i < this.chartProp[this.valueType].data.length; i += 1) {
        focusGroup.append('path')
          .attr('fill', 'none')
          .attr('class', () => `stroke-series-color-${i}`)
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', valueline(this.chartProp[this.valueType].data[i].data));
      }
    },
    onFrequencyValueTypeChange(checked) {
      this.valueType = checked;
      this.drawChart();
    },
  },
  computed: {
    flatDomainItems() {
      const domainData = this.chartProp[this.valueType].data;
      const domainItems = [];
      for (let i = 0; i < domainData.length; i += 1) {
        for (let j = 0; j < domainData[i].data.length; j += 1) {
          domainItems.push(domainData[i].data[j]);
        }
      }
      return domainItems;
    },
    dataMax() {
      return max(this.flatDomainItems, (d) => d[this.yKey]);
    },
    dataMin() {
      return min(this.flatDomainItems, (d) => d[this.yKey]);
    },
    xScale() {
      return d3.scaleTime()
        .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right])
        .domain(d3.extent(this.flatDomainItems, (d) => d[this.xKey]));
    },
    yScale() {
      return d3.scaleLinear()
        .range([this.svgHeight - this.svgPadding.top - this.svgPadding.bottom, 0])
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

.corpsum-chart {
  position: relative;
}

.gridlines line {
  stroke: lightgrey;
  stroke-opacity: 0.7;
  shape-rendering: crispEdges;
}

.gridlines path {
  stroke-width: 0;
}

</style>
