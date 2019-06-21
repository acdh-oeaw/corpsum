<template>
  <div :key="componentKey">
    <wordcloud
      v-for="(element, index) in clouds"
      v-bind:key="element.id"
      v-bind:chartProp="element.cloudData"
      v-bind:elKey="index"
      v-bind:elWidth="12/clouds.length"
    />
  </div>
</template>

<script>
import wordcloud from '@/components/charts/wordcloud.vue'

export default {
  props: {
    chartProp: Object
  },
  components: {
    wordcloud
  },
  data() {
    return {
      componentKey: 0,
      clouds: this.chartProp.clouds,
      class: 'col-md-'+12 / this.chartProp.clouds.length+' vis-component',
    };
  },
  created() {
  },
  mounted() {
  },
  watch: {
    clouds(val) {
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