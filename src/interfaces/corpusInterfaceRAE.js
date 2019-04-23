export default {
  data() {
    return {
      engineApi: 'http://192.168.3.19:3010/corpus/',
    };
  },
  methods: {
    initialSearchQuery(chartData, queryTerm) {
      const updatedData = this.axios.post(`${this.engineApi}search/`, { corpus: 'corpes', query: queryTerm }).then((response) => {
        const facetsData = this.axios.post(`${this.engineApi}fetch-dists/`, { corpus: 'corpes', fmt: 'json', result: response.data.result }).then((facetsResponse) => {
          console.log(facetsResponse.data);
          const temporalDataUpdate = this.processFreqTemporalData(facetsResponse.data[6].data, queryTerm);
          const mapCountries = this.processCountriesMapData(facetsResponse.data[1].data, queryTerm);
          const dispersionDataUpdate = this.processDispersionData(facetsResponse.data, queryTerm);
          return {
            temporal: {
              absolute: chartData.temporal.absolute.concat(temporalDataUpdate.absolute),
              relative: chartData.temporal.relative.concat(temporalDataUpdate.relative),
            },
            regional: chartData.regional.concat(mapCountries),
            dispersion: chartData.dispersion.concat(dispersionDataUpdate),
          };
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
      const outputAbs = { x: [], y: [], name: word };
      const outputRel = { x: [], y: [], name: word };
      for (let i = 0; i < items.length; i += 1) {
        outputAbs.x.push(items[i][0]);
        outputAbs.y.push(items[i][2]);
        outputRel.x.push(items[i][0]);
        outputRel.y.push(items[i][1]);
      }
      const output = { absolute: outputAbs, relative: outputRel };
      // Sort by year
      // output.sort((a, b) => a.key - b.key);
      // Return processed data
      return output;
    },
    processDispersionData(data, word) {
      const output = {
        type: 'scatterpolar',
        r: [],
        theta: ['Year', 'Country', 'Region', 'Type', 'Medium', 'Theme', 'Year'],
        fill: 'toself',
        name: word,
      };
      const facets = [data[6], data[1], data[7], data[0], data[3], data[4]];
      for (let i = 0; i < facets.length; i += 1) {
        output.r.push(facets[i].disp);
      }
      return output;
    },
  },
};
