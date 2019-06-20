<template>
  <div>
    <choroplethMap
      v-for="element in maps"
      v-bind:key="element.key"
      v-bind:chartProp="element.mapData"
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
      maps: this.chartProp.maps,
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss">
</style>