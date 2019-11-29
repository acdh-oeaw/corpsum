<template>
  <div>
    <b-alert show class="mb-0" variant="primary">{{title}}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    chartProp: Object,
  },
  data() {
    return {
      title: this.chartProp.title,
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
