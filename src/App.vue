<template>
  <div id="app">
    <topNav/>
    <div class="container-fluid">
      <div class="row">
        <sideNav/>
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
  watch: {
  },
  methods: {
  },
};
</script>

<style lang="scss">
/*
 * Dashboard CSS
 */
@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono&display=swap');
@import url('https://fonts.googleapis.com/css?family=Asap&display=swap');
@import url('https://fonts.googleapis.com/css?family=Fira+Sans&display=swap');
@import url('https://fonts.googleapis.com/css?family=Ubuntu&display=swap');
@import url('https://fonts.googleapis.com/css?family=Cabin&display=swap');
@import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
@import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
@import url('https://fonts.googleapis.com/css?family=Assistant&display=swap');


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
  font-family: 'Barlow', sans-serif !important;

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
  min-width: 180px;
}

main {
  max-width: calc(100% - 180px) !important;
}

</style>
