module.exports = {
  plugins: [
    require('postcss-import')({
      plugins: [require('stylelint')],
    }),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('postcss-nesting'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
