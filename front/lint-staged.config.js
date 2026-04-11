const add = 'git add';
const eslint = 'eslint --fix';
const prettier = 'prettier --write';

module.exports = {
  '*.{css,scss}': [prettier, add],
  '*.{html,json,md,yml}': [prettier, add],
  '*.{js,ts}': [prettier, eslint, add],
};
