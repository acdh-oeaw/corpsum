<template>
  <div :key="componentKey">
    <sankeyChart
      v-for="(element, index) in charts"
      v-bind:key="element.id"
      v-bind:chartProp="element.chartData"
      v-bind:parentKey="elKey"
      v-bind:elKey="index"
    />
  </div>
</template>

<script>
import sankeyChart from '@/components/charts/sankeyChart.vue';

export default {
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    sankeyChart,
  },
  data() {
    return {
      componentKey: 0,
      charts: this.chartProp.charts,
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    charts(val) {
      this.forceRerender();
    },
  },
  computed: {
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>

<style lang="scss">
</style>
