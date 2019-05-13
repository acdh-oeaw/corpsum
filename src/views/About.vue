<template>
  <div id="app">
    <topNav :queryTerms="queryTerms" @onQueryTermAdded="onQueryTermAdded" @onQueryTermRemoved="onQueryTermRemoved"/>
    <div class="container-fluid">
      <div class="row">
        <sideNav/>
        <main role="main" class="col-md-10 ml-sm-auto col-lg-11 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                Dropdown
              </button>
            </div>
          </div>
          <div class="home">

            <div class="row">
              About this corpus
            </div>

          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store/store';
import topNav from '@/components/topNav.vue';
import sideNav from '@/components/sideNav.vue';

export default {
  name: 'about',
  store,
  components: {
    topNav, sideNav,
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
