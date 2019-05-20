<template>
    <main role="main" class="col-md-10 ml-sm-auto col-lg-11 px-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Corpus Information</h1>
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
        <div class="row vis-wrapper">
          <stackedBarChart :chartProp="infoData.mostUsed" class="col-md-4 vis-component"></stackedBarChart>
        </div>
      </div>
    </main>
</template>

<script>
// @ is an alias to /src
import stackedBarChart from '@/components/charts/stackedBarChart.vue'

export default {
  name: 'analysis',
  components: {
    stackedBarChart,
  },
  data() {
    return {
      infoData: this.$store.getters.infoData,
    };
  },
  created(){
    this.$store.dispatch('mostUsedQuery');
  },
  mounted() {
    console.log("mounted");
    var pckry = new Packery( '.vis-wrapper', {
      itemSelector: '.vis-component',
      columnWidth: ".vis-component.col-md-4",
      gutter: 0,
      percentPosition: true
    });

    pckry.getItemElements().forEach( function( itemElem ) {
      var draggie = new Draggabilly( itemElem );
      pckry.bindDraggabillyEvents( draggie );
    });
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
.vis-component > div {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.vis-component {
  padding: .5rem!important;
}
</style>