module.exports = {
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
        `,
      },
    },
  },
  outputDir: 'html',
  configureWebpack: {
    devtool: 'eval-source-map',
  },
};
