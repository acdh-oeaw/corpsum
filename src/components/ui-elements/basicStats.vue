<template>
  <div>
    <b-card bg-variant="info" text-variant="white" :header="statName" class="text-center">
      <b-card-text>{{statValue}}</b-card-text>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    chartProp: Object,
  },
  data() {
    return {
      statName: this.chartProp.statName,
      statValue: this.chartProp.statValue,
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
