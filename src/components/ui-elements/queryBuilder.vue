<template>
  <div>
    <div v-for="element in queryTerms" v-bind:key="element.key">
      {{ element }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chartProp: Array,
  },
  data() {
    return {
      queryTerms: this.chartProp,
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
