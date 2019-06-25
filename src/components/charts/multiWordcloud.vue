<template>
  <div :key="componentKey">
    <wordcloud
      v-for="(element, index) in clouds"
      v-bind:key="element.id"
      v-bind:chartProp="element.cloudData"
      v-bind:parentKey="elKey"
      v-bind:elKey="index"
    />
  </div>
</template>

<script>
import wordcloud from '@/components/charts/wordcloud.vue'

export default {
  props: {
    chartProp: Object,
    elKey: Number
  },
  components: {
    wordcloud
  },
  data() {
    return {
      componentKey: 0,
      clouds: this.chartProp.clouds,
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