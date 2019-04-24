export default {
  data() {
    return {
      engineApi: 'http://192.168.3.19:3010/corpus/',
    };
  },
  methods: {
    initialSearchQuery(chartData, queryTerm) {
      const updatedData = this.axios.post(`${this.engineApi}search/`, { corpus: 'corpes', form: [{ word: 'teléfono' }, { word: queryTerm }] }).then((response) => {
        const facetsData = this.axios.post(`${this.engineApi}fetch-dists/`, { corpus: 'corpes', fmt: 'json', result: response.data.result }).then((facetsResponse) => {
          console.log(facetsResponse.data);
          console.log(response.data.result);
          const temporalDataUpdate = this.processFreqTemporalData(facetsResponse.data[6].data, queryTerm);
          const regionalDataUpdate = this.processRegionalData(facetsResponse.data, chartData, queryTerm);
          const dispersionDataUpdate = this.processDispersionData(facetsResponse.data, queryTerm);
          // const typesDataUpdate = this.processTypesData(facetsResponse.data[0].data, queryTerm);
          return {
            temporal: {
              absolute: chartData.temporal.absolute.concat(temporalDataUpdate.absolute),
              relative: chartData.temporal.relative.concat(temporalDataUpdate.relative),
            },
            regional: {
              countries: chartData.regional.countries.concat(regionalDataUpdate.countries),
              regions: chartData.regional.regions,
            },
            dispersion: chartData.dispersion.concat(dispersionDataUpdate),
            // types: chartData.types.concat(typesDataUpdate),
          };
        });
        return facetsData;
      });
      return updatedData;
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
    processRegionalData(responseData, chartData, word) {
      // COUNTRIES
      const outputCountries = [];
      const itemsCountries = responseData[1].data;
      for (let i = 0; i < itemsCountries.length; i += 1) {
        outputCountries.push({
          group: word, key: itemsCountries[i][0], value: itemsCountries[i][2], relValue: itemsCountries[i][1],
        });
      }
      // Sort by country
      outputCountries.sort((a, b) => a.key - b.key);
      // REGIONS
      const outputRegions = chartData.regional.regions[0];
      outputRegions.y.push(word);
      outputRegions.z.push([]);
      const tableRow = this.getKeyByValue(outputRegions.y, word);
      const itemsRegions = responseData[7].data;
      for (let i = 0; i < itemsRegions.length; i += 1) {
        outputRegions.x.push(itemsRegions[i][0]);
        outputRegions.z[tableRow].push(itemsRegions[i][1]);
      }
      // Return processed data
      const output = { countries: outputCountries, regions: outputRegions };
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
    processTypesData(data, word) {
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
    getKeyByValue(array, value) {
      return Object.keys(array).find(key => array[key] === value);
    },
  },
};
