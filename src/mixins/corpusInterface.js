export default {
  methods: {
    processFreqTemporalData(data) {
      const items = data.Blocks[0].Items;
      const output = [];
      for (let i = 0; i < items.length; i += 1) {
        output.push({ key: items[i].Word[0].n, value: items[i].freq });
      }
      return output;
    },
  },
};
