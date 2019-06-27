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
