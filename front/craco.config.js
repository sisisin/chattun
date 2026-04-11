const webpack = require('webpack');

module.exports = {
  eslint: {
    enable: false,
  },
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({ process: 'process/browser', Buffer: ['buffer', 'Buffer'] }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve('buffer/'),
        },
      },
    },
  },
};
