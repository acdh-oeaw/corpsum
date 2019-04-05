<template>
  <div class="home">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <d3-multi-line
        :data="freqTemporalData"
        width="100%"
        height="300px">
    </d3-multi-line>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

const d3 = Object.assign({},
  require('d3-fetch'));

export default {
  name: 'home',
  components: {
    // HelloWorld,
  },
  data() {
    return {
      freqTemporalData: [],
    };
  },
  mounted() {
    console.log('Home loaded');
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.freqTemporalData = await d3.json('./freqTemporalData.json');
    },
  },
};
</script>
