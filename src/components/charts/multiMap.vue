<template>
  <div :key="componentKey">
    <choroplethMap
      v-for="(element, index) in maps"
      v-bind:key="element.id"
      v-bind:chartProp="element.mapData"
      v-bind:elKey="index"
      v-bind:elHeight="480/maps.length"
    />
  </div>
</template>

<script>
import choroplethMap from '@/components/charts/choroplethMap.vue'

export default {
  props: {
    chartProp: Object
  },
  components: {
    choroplethMap
  },
  data() {
    return {
      componentKey: 0,
      maps: this.chartProp.maps,
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    maps(val) {
      this.forceRerender();
    }
  },
  computed: {
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;  
    }
  },
};
</script>

<style lang="scss">
</style>