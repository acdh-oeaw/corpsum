export default {
  data() {
    return {
      engineApi: 'http://192.168.3.19:3010/corpus/',
      timeFreqQuery: 'freqtt?corpname=amc3_demo&format=json&fttattr=doc.year',
    };
  },
  methods: {
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
  },
};
