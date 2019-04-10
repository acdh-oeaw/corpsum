export default {
  data() {
    return {
      engineApi: 'http://192.168.3.19:3010/corpus/',
    };
  },
  methods: {
    initialSearchQuery(freqTemporalData, mapData, queryTerm) {
      const updatedData = this.axios.post(`${this.engineApi}search/`, { corpus: 'corpes', query: queryTerm }).then((response) => {
        const facetsData = this.axios.post(`${this.engineApi}fetch-facets/`, { corpus: 'corpes', result: response.data.result }).then((facetsResponse) => {
          const wordFreq = this.processFreqTemporalData(facetsResponse.data.facets[0], queryTerm);
          const mapCountries = this.processCountriesMapData(facetsResponse.data.facets[3], queryTerm);
          return { temporal: freqTemporalData.concat(wordFreq), regional: mapData.concat(mapCountries) };
        });
        return facetsData;
      });
      return updatedData;
    },
    processCountriesMapData(data, word) {
      const items = data.values;
      const output = [];
      for (let i = 0; i < items.length; i += 1) {
        output.push({ group: word, key: items[i].id, value: items[i].count });
      }
      // Sort by country
      output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
    processFreqTemporalData(data, word) {
      const items = data.values;
      const output = [];
      for (let i = 0; i < items.length; i += 1) {
        output.push({ group: word, key: items[i].id, value: items[i].count });
      }
      // Sort by year
      output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
    queryRegionsData() {
      const mapData = this.axios.get('http://timwis.com/leaflet-choropleth/examples/basic/crimes_by_district.geojson').then((response) => {
        return response.data;
      });
      return mapData;
    },
  },
};

