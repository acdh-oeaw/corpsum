const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const basicAuth = require('express-basic-auth');

if (process.env.NODE_ENV === 'production') {
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
      devtool: '',
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              minSize: 50000,
              maxSize: 250000,
            },
          },
        },
      },
      plugins: [new CompressionPlugin()],
    },
  };
} else {
  module.exports = {
    css: {
      // sourceMap: true,
      loaderOptions: {
        sass: {
          data: `
            @import "@/scss/_variables.scss";
          `,
        },
      },
    },
    outputDir: 'public',
    configureWebpack: {
      devtool: 'eval-source-map',
    },
    devServer: {
      // before(app) {
      //   app.use(basicAuth({
      //     users: {
      //       corpsum: '<the real corpsum-proxy password>', // do not git this!!!
      //     },
      //     realm: 'Auhorization Required',
      //     challenge: true,
      //   }))
      // }
    }
  };
}
