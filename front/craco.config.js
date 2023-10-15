const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          path: require.resolve('path-browserify'),
          os: require.resolve('os-browserify/browser'),
        },
      },
    },
  },
};
