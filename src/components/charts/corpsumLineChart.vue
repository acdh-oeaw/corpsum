<template>
  <div>
    <div class="vis-component-inner">
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
              <g class="gridlines gridlines-y" ref="gridlinesY"></g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DownloadIcon, ImageIcon, ListIcon, BarChart2Icon, InfoIcon,
} from 'vue-feather-icons';

import { scaleLinear, scaleTime } from 'd3-scale';
import { max, min, extent } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveCardinal } from 'd3-shape';
import { format } from 'd3-format';

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
      showWordForms: false,
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
      select(this.$refs.chartGroup)
        .attr('transform', `translate(${this.svgPadding.left},${this.svgPadding.top})`);
      this.drawXAxis();
      this.drawYAxis();
      this.drawLines();
      this.drawGridlines();
    },
    drawXAxis() {
      select(this.$refs.axisX)
        .attr('transform', `translate( 0, ${this.svgHeight - this.svgPadding.top - this.svgPadding.bottom} )`)
        .call(axisBottom(this.xScale).tickFormat(format('d')));
    },
    drawYAxis() {
      select(this.$refs.axisY)
        .call(axisLeft(this.yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');
    },
    drawLines() {
      const focusGroup = select(this.$refs.focusGroup);
      focusGroup.selectAll('.line-path').remove();
      const pathLine = line()
        .curve(curveCardinal.tension(0.5))
        .x((d) => this.xScale(d.year))
        .y((d) => this.yScale(d.value));
      for (let i = 0; i < this.chartData[this.valueType].data.length; i += 1) {
        focusGroup.append('path')
          .attr('fill', 'none')
          .attr('class', () => `line-path stroke-series-color-${i}`)
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', pathLine(this.chartData[this.valueType].data[i].data));
      }
    },
    drawGridlines() {
      select(this.$refs.gridlinesY)
        .call(axisLeft(this.yScale).ticks(5).tickSize(-this.svgWidth + this.svgPadding.left + this.svgPadding.right).tickFormat(''));
    },
    onFrequencyValueTypeChange(checked) {
      this.valueType = checked;
      this.drawChart();
    },
    exportImage() {
      this.$refs.chart.$children[0].chart.exportChartLocal({ type: 'image/svg+xml' });
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
    onWordFormToggle() {
      this.drawChart();
    },
  },
  computed: {
    chartData() {
      if (this.showWordForms === false) {
        return this.chartProp;
      } return this.chartProp.wordForms;
    },
    flatDomainItems() {
      const domainData = this.chartData[this.valueType].data;
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
      return scaleTime()
        .range([0, this.svgWidth - this.svgPadding.left - this.svgPadding.right])
        .domain(extent(this.flatDomainItems, (d) => d[this.xKey]));
    },
    yScale() {
      return scaleLinear()
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
