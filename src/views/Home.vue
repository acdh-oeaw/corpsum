<template>
  <div id="app">
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-2 col-md-1 mr-0" href="#">vis-corpus</a>
      <tags-input element-id="queryTerms" class="w-100"
        v-model="queryTerms"
        placeholder="Type another term to query"
        @tag-added="onQueryTermAdded"
        @tag-removed="onQueryTermRemoved">
      </tags-input>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#">Sign out</a>
        </li>
      </ul>
    </nav>
    <div class="container-fluid">
      <div class="row">

        <sideNav></sideNav>

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
            <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

            <d3-multi-line
                :data="freqTemporalData"
                width="100%"
                height="300px">
            </d3-multi-line>

            <mapChart :mapData="mapData"></mapChart>

          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import sideNav from '@/components/sideNav.vue';
import mapChart from '@/components/d3-charts/map.vue';
import corpusInterface from '@/interfaces/corpusInterface';

export default {
  name: 'home',
  components: {
    sideNav, mapChart,
    // HelloWorld,
  },
  mixins: [corpusInterface],
  data() {
    return {
      freqTemporalData: [{"group":"coche","key":"2001","value":1389},{"group":"coche","key":"2002","value":1329},{"group":"coche","key":"2003","value":1063},{"group":"coche","key":"2004","value":1257},{"group":"coche","key":"2005","value":1368},{"group":"coche","key":"2006","value":1102},{"group":"coche","key":"2007","value":1225},{"group":"coche","key":"2008","value":1377},{"group":"coche","key":"2009","value":1204},{"group":"coche","key":"2010","value":1445},{"group":"coche","key":"2011","value":1288},{"group":"coche","key":"2012","value":1330},{"group":"coche","key":"2013","value":12},{"group":"coche","key":"2014","value":1},{"group":"coche","key":"2015","value":0},{"group":"auto","key":"2001","value":875},{"group":"auto","key":"2002","value":749},{"group":"auto","key":"2003","value":713},{"group":"auto","key":"2004","value":869},{"group":"auto","key":"2005","value":837},{"group":"auto","key":"2006","value":1171},{"group":"auto","key":"2007","value":921},{"group":"auto","key":"2008","value":932},{"group":"auto","key":"2009","value":1104},{"group":"auto","key":"2010","value":993},{"group":"auto","key":"2011","value":1171},{"group":"auto","key":"2012","value":965},{"group":"auto","key":"2013","value":10},{"group":"auto","key":"2014","value":9},{"group":"auto","key":"2015","value":120},{"group":"carro","key":"2001","value":418},{"group":"carro","key":"2002","value":512},{"group":"carro","key":"2003","value":479},{"group":"carro","key":"2004","value":402},{"group":"carro","key":"2005","value":671},{"group":"carro","key":"2006","value":766},{"group":"carro","key":"2007","value":696},{"group":"carro","key":"2008","value":546},{"group":"carro","key":"2009","value":511},{"group":"carro","key":"2010","value":729},{"group":"carro","key":"2011","value":648},{"group":"carro","key":"2012","value":416},{"group":"carro","key":"2013","value":3},{"group":"carro","key":"2014","value":7},{"group":"carro","key":"2015","value":0}],
      mapData: [{"group":"coche","key":"Argentina","value":828,"id":32},{"group":"coche","key":"Bolivia","value":115,"id":68},{"group":"coche","key":"Chile","value":223,"id":152},{"group":"coche","key":"Colombia","value":130,"id":170},{"group":"coche","key":"Costa_Rica","value":14,"id":188},{"group":"coche","key":"Cuba","value":274,"id":192},{"group":"coche","key":"Ecuador","value":78,"id":218},{"group":"coche","key":"El_Salvador","value":63,"id":222},{"group":"coche","key":"España","value":11273,"id":724},{"group":"coche","key":"Estados_Unidos","value":186,"id":840},{"group":"coche","key":"Filipinas","value":2,"id":608},{"group":"coche","key":"Guatemala","value":155,"id":320},{"group":"coche","key":"Guinea_Ecuatorial","value":138,"id":226},{"group":"coche","key":"Honduras","value":26,"id":340},{"group":"coche","key":"México","value":1230,"id":484},{"group":"coche","key":"Nicaragua","value":34,"id":558},{"group":"coche","key":"Panamá","value":15,"id":591},{"group":"coche","key":"Paraguay","value":136,"id":600},{"group":"coche","key":"Perú","value":97,"id":604},{"group":"coche","key":"Puerto_Rico","value":43,"id":630},{"group":"coche","key":"República_Dominicana","value":94,"id":214},{"group":"coche","key":"Uruguay","value":128,"id":858},{"group":"coche","key":"Venezuela","value":108,"id":862},{"group":"auto","key":"Argentina","value":2858,"id":32},{"group":"auto","key":"Bolivia","value":158,"id":68},{"group":"auto","key":"Chile","value":1476,"id":152},{"group":"auto","key":"Colombia","value":415,"id":170},{"group":"auto","key":"Costa_Rica","value":161,"id":188},{"group":"auto","key":"Cuba","value":371,"id":192},{"group":"auto","key":"Ecuador","value":223,"id":218},{"group":"auto","key":"El_Salvador","value":218,"id":222},{"group":"auto","key":"España","value":1317,"id":724},{"group":"auto","key":"Estados_Unidos","value":266,"id":840},{"group":"auto","key":"Filipinas","value":12,"id":608},{"group":"auto","key":"Guatemala","value":139,"id":320},{"group":"auto","key":"Guinea_Ecuatorial","value":7,"id":226},{"group":"auto","key":"Honduras","value":113,"id":340},{"group":"auto","key":"México","value":1344,"id":484},{"group":"auto","key":"Nicaragua","value":47,"id":558},{"group":"auto","key":"Panamá","value":104,"id":591},{"group":"auto","key":"Paraguay","value":415,"id":600},{"group":"auto","key":"Perú","value":531,"id":604},{"group":"auto","key":"Puerto_Rico","value":278,"id":630},{"group":"auto","key":"República_Dominicana","value":164,"id":214},{"group":"auto","key":"Uruguay","value":437,"id":858},{"group":"auto","key":"Venezuela","value":385,"id":862},{"group":"carro","key":"Argentina","value":152,"id":32},{"group":"carro","key":"Bolivia","value":83,"id":68},{"group":"carro","key":"Chile","value":157,"id":152},{"group":"carro","key":"Colombia","value":1609,"id":170},{"group":"carro","key":"Costa_Rica","value":160,"id":188},{"group":"carro","key":"Cuba","value":294,"id":192},{"group":"carro","key":"Ecuador","value":225,"id":218},{"group":"carro","key":"El_Salvador","value":174,"id":222},{"group":"carro","key":"España","value":816,"id":724},{"group":"carro","key":"Estados_Unidos","value":92,"id":840},{"group":"carro","key":"Filipinas","value":1,"id":608},{"group":"carro","key":"Guatemala","value":374,"id":320},{"group":"carro","key":"Guinea_Ecuatorial","value":5,"id":226},{"group":"carro","key":"Honduras","value":160,"id":340},{"group":"carro","key":"México","value":556,"id":484},{"group":"carro","key":"Nicaragua","value":115,"id":558},{"group":"carro","key":"Panamá","value":98,"id":591},{"group":"carro","key":"Paraguay","value":70,"id":600},{"group":"carro","key":"Perú","value":322,"id":604},{"group":"carro","key":"Puerto_Rico","value":249,"id":630},{"group":"carro","key":"República_Dominicana","value":277,"id":214},{"group":"carro","key":"Uruguay","value":87,"id":858},{"group":"carro","key":"Venezuela","value":728,"id":862}],
      queryTerms: [],
    };
  },
  created() {
  },
  mounted() {
    /*
    this.queryRegionsData()
      .then((response) => {
      this.mapData = response;
    });
    */
  },
  watch: {
  },
  methods: {
    onQueryTermAdded(queryTerm) {
      this.initialSearchQuery(this.freqTemporalData, this.mapData, queryTerm)
        .then((response) => {
        this.freqTemporalData = response.temporal;
        this.mapData = response.regional;
      });
    },
    onQueryTermRemoved(queryTerm) {
      this.freqTemporalData = this.freqTemporalData.filter(function( termData ) {
          return termData.group !== queryTerm;
      });
      this.mapData = this.mapData.filter(function( termData ) {
          return mapData.group !== queryTerm;
      });
    },
  },
};
</script>
