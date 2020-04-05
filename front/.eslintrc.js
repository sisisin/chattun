/** @type {import('eslint').Linter.Config} */
const tsBaseConfig = {
  extends: [
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  plugins: ['react', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    useJSXTextNode: true,
    project: './tsconfig.json',
  },
  env: { browser: true, jest: true },
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0, // todo
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDefinitionFiles: true,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-router-dom',
            importNames: ['useLocation', 'useParams', 'useHistory'],
            message: 'useRouteState.tsを使って（API足りない場合はこっちに追加して）',
          },
          {
            name: 'react-router',
            message: 'react-router-domを使いましょう',
          },
        ],
      },
    ],
  },
};

module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended', 'prettier/react'],
  overrides: [
    {
      ...tsBaseConfig,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        ...tsBaseConfig.rules,
        'no-restricted-imports': [
          'error',
          {
            paths: [
              ...tsBaseConfig.rules['no-restricted-imports'][1]['paths'],
              {
                name: 'typeless',
                importNames: ['defaultRegistry'],
                message: 'appRegistryを使って',
              },
              {
                name: 'typeless',
                importNames: ['DefaultTypelessProvider'],
                message: 'TypelessContextを使って',
              },
            ],
          },
        ],
      },
    },
    {
      ...tsBaseConfig,
      files: ['**/*.test.ts', '**/*.test.tsx', '**/stories.tsx'],
      rules: {
        ...tsBaseConfig.rules,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },
  ],
};
