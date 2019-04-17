export default {
  data() {
    return {
      engineApi: 'http://192.168.3.19:3010/corpus/',
    };
  },
  methods: {
    initialSearchQuery(freqTemporalData, mapData, queryTerm) {
      const updatedData = this.axios.post(`${this.engineApi}search/`, { corpus: 'corpes', query: queryTerm }).then((response) => {
        const facetsData = this.axios.post(`${this.engineApi}fetch-dists/`, { corpus: 'corpes', fmt: 'json', result: response.data.result }).then((facetsResponse) => {
          console.log(facetsResponse.data);
          const wordFreq = this.processFreqTemporalData(facetsResponse.data[6].data, queryTerm);
          const mapCountries = this.processCountriesMapData(facetsResponse.data[1].data, queryTerm);
          return { temporal: freqTemporalData.concat(wordFreq), regional: mapData.concat(mapCountries) };
        });
        return facetsData;
      });
      return updatedData;
    },
    processCountriesMapData(data, word) {
      const items = data;
      const output = [];
      for (let i = 0; i < items.length; i += 1) {
        output.push({
          group: word, key: items[i][0], value: items[i][2], relValue: items[i][1],
        });
      }
      // Sort by country
      output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
    processFreqTemporalData(data, word) {
      const items = data;
      const output = { x: [], y: [] };
      for (let i = 0; i < items.length; i += 1) {
        output.x.push(items[i][0]);
        output.y.push(items[i][2]);
      }
      // Sort by year
      // output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
  },
};
