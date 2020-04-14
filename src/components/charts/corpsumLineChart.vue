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
            :pressed.sync="showCollocations"
            variant="outline-primary"
            size="sm"
          >
            Collocations
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
          <b-button variant="primary" @click="showTable" v-show="showTableIcon" v-b-tooltip.hover title="Show data table">
            <list-icon></list-icon>
          </b-button>
          <b-button variant="primary" @click="showChart" v-show="showChartIcon" v-b-tooltip.hover title="Show chart">
            <bar-chart-2-icon></bar-chart-2-icon>
          </b-button>
          <b-button variant="primary" @click="exportCSV" v-b-tooltip.hover title="Export data as CSV">
            <download-icon></download-icon>
          </b-button>
          <b-button variant="primary" @click="exportImage" v-b-tooltip.hover title="Export image as SVG">
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
            <g class="tooltips" v-show="showCollocations" ref="tooltips"></g>
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
    this.drawChart();
    this.bus.$on('onDrilldownClick', (payload) => {
      this.wordFormsToShow = payload.barsData;
      this.wordFormsBarIndex = payload.i;
      this.drawChart(payload.i);
    });
    this.bus.$on('onDrilldownGoBack', () => {
      this.wordFormsToShow = false;
      this.wordFormsBarIndex = false;
      this.drawChart();
    });
    this.bus.$on('onBarHover', (payload) => {
      this.highlightLine(payload.name, payload.flag);
    });
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
      wordFormsToShow: false,
      wordFormsBarIndex: false,
      showCollocations: true,
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
      focusGroup.selectAll('.line-group').remove();
      const pathLine = line()
        .curve(curveCardinal.tension(0.5))
        .x((d) => this.xScale(d.year))
        .y((d) => this.yScale(d.value));
      for (let i = 0; i < this.chartData[this.valueType].data.length; i += 1) {

        const pathGroup = focusGroup.append('g')
          .attr('id', () => { return `line-group-${i}`; })
          .attr('class', 'line-group');

        pathGroup.append('path')
          .attr('fill', 'none')
          .attr('class', () => { if (this.wordFormsBarIndex !== false) { return `line-path stroke-series-color-${this.wordFormsBarIndex} line-id-${i}`; } return `line-path stroke-series-color-${i} line-id-${i}`; })
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', pathLine(this.chartData[this.valueType].data[i].data));

        for (let j = 0; j < this.chartData[this.valueType].data[i].data.length; j += 1) {
          pathGroup.append('circle')
            .attr('cx', () => this.xScale(this.chartData[this.valueType].data[i].data[j][this.xKey]))
            .attr('cy', () => this.yScale(this.chartData[this.valueType].data[i].data[j][this.yKey]))
            .attr('class', () => { if (this.wordFormsBarIndex !== false) { return `line-data-circle bg-series-color-${this.wordFormsBarIndex}`; } return `line-data-circle bg-series-color-${i}`; })
            .attr('r', '4')
            .style('cursor', 'pointer')
            .on('mouseover', () => { this.onLineCircleMouseOver(this.chartData[this.valueType].data[i].data[j][this.xKey], this.chartData[this.valueType].data[i].name, {x: this.xScale(this.chartData[this.valueType].data[i].data[j][this.xKey]), y: this.yScale(this.chartData[this.valueType].data[i].data[j][this.yKey])}, i)})
            .on('mouseout', () => { this.onLineCircleMouseOut(); })
            .on('click', () => { this.onLineCircleClick(this.chartData[this.valueType].data[i].data[j][this.xKey], this.chartData[this.valueType].data[i].name); })

            //.on('mouseover', () => { this.handleLineMouseOver(i, 1) })
            //.on('mouseout', () => { this.handleLineMouseOver(i, 0) });
        }

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
    onLineCircleClick(year, query) {
      this.bus.$emit('onLineCircleClick', { year, query });
    },
    onLineCircleMouseOver(year, query, position, iParent) {
      let collxData = [];
      for (let i = 0; i < this.chartData.collocations.length; i += 1) {
        const d = this.chartData.collocations[i];
        if (d.year === year && d.query === query) {
          collxData = d.data;
          break;
        }
      }
      let collxGroup;
      if (collxData) {
        collxGroup = select(this.$refs.tooltips).append('g')
          .attr('class', 'line-collx-group');

        collxGroup.append('rect')
          .attr('class', () => `line-collx-rect line-path stroke-series-color-${iParent}`)
          .attr('x', () => position.x + 8)
          .attr('y', () => position.y - 8)
          .attr('width', 100)
          .attr('height', 132);
      }
      for (let j = 0; j < collxData.length; j += 1) {
        collxGroup.append('text')
          .text(() => {
            if (collxData[j].name.length > 13) {
              return `${collxData[j].name.slice(0, 10)}...`;
            } return collxData[j].name;
          })
          .attr('class', 'line-collx-text')
          .attr('x', () => position.x + 11)
          .attr('y', () => position.y + 3 + j * 13)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .style('opacity', 1);

        collxGroup.append('text')
          .text(() => collxData[j].logDice)
          .attr('class', 'line-collx-text')
          .attr('x', () => position.x + 105)
          .attr('y', () => position.y + 3 + j * 13)
          .attr('text-anchor', 'end')
          .attr('font-weight', 'bold')
          .style('opacity', 1);
      }
    },
    onLineCircleMouseOut() {
      select(this.$refs.tooltips).select('.line-collx-group').remove();
    },
    highlightLine(queryName, flag) {
      const lineID = this.getObjectKey(this.chartData[this.valueType].data, queryName, 'name');
      select(this.$refs.focusGroup).select(`.line-id-${lineID}`).classed('line-path-hovered', flag);
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
    getObjectKey(object, value, property) {
      if (property) return Object.keys(object).find((key) => object[key][property] === value);
      return Object.keys(object).find((key) => object[key] === value);
    },
  },
  computed: {
    chartData() {
      if (this.wordFormsToShow) {
        const wordFormsLines = { absolute: { data: [] }, relative: { data: [] } };
        for (let i = 0; i < this.wordFormsToShow.length; i += 1) {
          let key = this.getObjectKey(this.chartProp.wordForms.absolute.data, `[word="${this.wordFormsToShow[i].name}"]`, 'name');
          wordFormsLines.absolute.data.push(this.chartProp.wordForms[this.valueType].data[key]);
          key = this.getObjectKey(this.chartProp.wordForms.relative.data, `[word="${this.wordFormsToShow[i].name}"]`, 'name');
          wordFormsLines.relative.data.push(this.chartProp.wordForms[this.valueType].data[key]);
        }
        return wordFormsLines;
      } return this.chartProp;
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

.line-collx-rect {
  fill: #fff;
}

.line-collx-text {
  font-size: 0.70rem;
}

.line-path-hovered {
  stroke-width: 3.5px;
}

</style>