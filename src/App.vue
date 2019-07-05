<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <sideNav/>
        <topNav v-bind:tags="tags"/>
        <router-view name="Content"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import topNav from '@/components/topNav.vue';
import sideNav from '@/components/sideNav.vue';

export default {
  name: 'App',
  components: {
    topNav, sideNav
  },
  mixins: [],
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  computed: {
    tags() {
      return this.$store.getters.queryTerms;
    },
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
/*
 * Dashboard CSS
 */
@import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
@import url('https://fonts.googleapis.com/css?family=Signika&display=swap');

body {
  font-size: .875rem;
  font-family: 'Barlow', sans-serif;
  background-color: #f5f6f9;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.highcharts-root {

  * {
    font-family: 'Barlow', sans-serif !important;
    font-weight: 400 !important;
  }

  .highcharts-point {
    opacity: 0.95;
  }

  .highcharts-tooltip-box {
    stroke-opacity: 0.5;
    fill: #f5f6f9;
  }

  .highcharts-shadow {
    display: none;
  }

}

.bg-series-color-0 {
  background-color: #4e79a7;
}
.bg-series-color-1 {
  background-color: #edc948;
}
.bg-series-color-2 {
  background-color: #e15759;
}
.bg-series-color-3 {
  background-color: #76b7b2;
}
.bg-series-color-4 {
  background-color: #f28e2b;
}
.bg-series-color-5 {
  background-color: #ff9da7;
}
.bg-series-color-6 {
  background-color: #FF9655;
}
.bg-series-color-7 {
  background-color: #FFF263;
}
.bg-series-color-8 {
  background-color: #6AF9C4;
}

/*
 * Content
 */
[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}

@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}

.sidebar, .navbar-brand {
  min-width: 135px;
}

main {
  max-width: calc(100% - 135px) !important;
}

</style>
