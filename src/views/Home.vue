<template>
  <div class="home">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <d3-line
        :data="freqTemporalData"
        width="100%"
        height="300px">
    </d3-line>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import corpusInterface from '@/mixins/corpusInterface';

export default {
  name: 'home',
  components: {
    // HelloWorld,
  },
  mixins: [corpusInterface],
  data() {
    return {
      freqTemporalData: [],
      engineApi: 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/',
      timeFreqQuery: 'freqtt?q=aword,[lc="haus"+|+lemma="haus"];corpname=amc3_demo;fttattr=doc.yymm;fcrit=doc.id;flimit=0;format=json',
    };
  },
  created() {
  },
  mounted() {
    console.log('Home loaded');
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.axios.get('http://www.mocky.io/v2/5ca7bf9d520000b50b97b6d0')
        .then((response) => { this.freqTemporalData = this.processFreqTemporalData(response.data); console.log(this.freqTemporalData); });
    },
  },
};
</script>
