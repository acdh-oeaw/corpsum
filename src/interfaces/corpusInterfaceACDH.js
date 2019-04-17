export default {
  data() {
    return {
      engineApi: 'https://demo-amc3.acdh-dev.oeaw.ac.at/run.cgi/',
      timeFreqQuery: 'freqtt?corpname=amc3_demo&format=json&fttattr=doc.year',
    };
  },
  methods: {
    queryFreqTemporalData(freqTemporalData, queryTerm) {
      const updatedData = this.axios.get(`${this.engineApi + this.timeFreqQuery}&q=q[lc="${queryTerm}"]`).then((response) => {
        const wordFreq = this.processFreqTemporalData(response.data, queryTerm);
        return freqTemporalData.concat(wordFreq);
      });
      return updatedData;
    },
    processFreqTemporalData(data, word) {
      const items = data.Blocks[0].Items;
      const output = [];
      for (let i = 0; i < items.length; i += 1) {
        output.push({ group: word, key: items[i].Word[0].n, value: items[i].freq });
      }
      // Sort by year
      output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
    queryRegionsData() {
      const mapData = this.axios.get('http://timwis.com/leaflet-choropleth/examples/basic/crimes_by_district.geojson').then(response => response.data);
      return mapData;
    },
  },
};
