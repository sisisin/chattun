import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'avoid',
    sortPackageJson: false,
    ignorePatterns: ['build/', 'node_modules/', 'public/sw.js', '.blueprints/'],
  },
  lint: {
    ignorePatterns: ['build/', 'node_modules/', 'public/sw.js', '.blueprints/'],
    plugins: ['react', 'typescript'],
    rules: {
      // --- react-app 相当 (react-hooks) ---
      'react/rules-of-hooks': 'error',
      'react/exhaustive-deps': 'warn',

      // --- no-restricted-imports ---
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-router-dom',
              importNames: ['useLocation', 'useParams', 'useHistory'],
              message: 'useRouter.tsを使って（API足りない場合はこっちに追加して）',
            },
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

      // --- @typescript-eslint 相当: eslintrc.js で OFF にしていたルール ---
      'typescript/no-explicit-any': 'off',
      'typescript/no-non-null-assertion': 'off',
      'typescript/explicit-function-return-type': 'off',

      // --- @typescript-eslint/no-namespace: error (allowDefinitionFiles) ---
      // oxlintはデフォルトで.d.tsファイルを許可する。元のeslint設定のallowDefinitionFiles相当。
      'typescript/no-namespace': 'error',
    },
  },
});
