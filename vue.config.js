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
  configureWebpack: {
    devtool: 'eval-source-map',
  },
};
