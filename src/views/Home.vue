<template>
  <div class="home">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <mapChart></mapChart>
    <input id="new-word-search">
    <button type="button" @click="addNewWord">Add new word</button>
    <li v-for="(word,i) in checkedWords" :key="i">
        {{word}}
        <button type="button" @click="removeWord(i)">Remove word</button>
    </li>

    <!--
    <div id='example-3'>
      <input type="checkbox" id="haus" value="haus" v-model="checkedWords">
      <label for="haus">haus</label>
      <input type="checkbox" id="auto" value="auto" v-model="checkedWords">
      <label for="auto">auto</label>
      <input type="checkbox" id="ball" value="ball" v-model="checkedWords">
      <label for="ball">ball</label>
      <br>
      <span>Checked workds: {{ checkedWords }}</span>
    </div>
    -->
    <span>Checked workds: {{ checkedWords }}</span>
    <d3-multi-line
        :data="freqTemporalData"
        width="100%"
        height="300px">
    </d3-multi-line>

    <!--
    <d3-l-choropleth :data="mapData">
    </d3-l-choropleth>
    -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import mapChart from '@/components/d3-charts/map.vue';
import corpusInterface from '@/mixins/corpusInterface';

export default {
  name: 'home',
  components: {
    mapChart,
    // HelloWorld,
  },
  mixins: [corpusInterface],
  data() {
    return {
      freqTemporalData: [],
      mapData: { coordinates: [{ lat: -25.363, lng: 131.044 }, { lat: 12.97, lng: 77.59 }] },
      checkedWords: ['haus'],
      // engineApi: 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/',
      engineApi: 'https://asilcetin.com/projects/amc-temp/api.php?',
      timeFreqQuery: 'freqtt?corpname=amc3_demo&format=json&fttattr=doc.year',
    };
  },
  created() {
  },
  mounted() {
    console.log('Home loaded');
    this.fetchData();
    // this.fetchMapData();
  },
  watch: {
    checkedWords(val) {
      this.fetchData();
      console.log(this.checkedWords);
    },
  },
  methods: {
    addNewWord() {
      const newWord = document.getElementById('new-word-search').value;
      this.checkedWords.push(newWord);
    },
    removeWord(index) {
      this.checkedWords.splice(index, 1);
    },
    fetchData() {
      this.freqTemporalData = [];
      for (let i = 0; i < this.checkedWords.length; i += 1) {
        this.axios.get(`${this.engineApi + this.timeFreqQuery}&q=q[lc="${this.checkedWords[i]}"]`)
          .then((response) => {
            const wordFreq = this.processFreqTemporalData(response.data, this.checkedWords[i]);
            this.freqTemporalData = this.freqTemporalData.concat(wordFreq);
          });
      }
    },
    fetchMapData() {
      this.axios.get('https://raw.githubusercontent.com/timwis/leaflet-choropleth/gh-pages/examples/basic/crimes_by_district.geojson')
        .then((response) => {
          this.mapData = response.data.features;
          console.log(response.data.features);
        });
    },
  },
};
</script>
