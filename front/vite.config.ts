import { configDefaults, defineConfig } from 'vite-plus';
import path from 'path';

export default defineConfig({
  oxc: {
    jsx: { runtime: 'classic' },
  },
  resolve: {
    alias: {
      app: path.resolve(import.meta.dirname, 'src/app'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, '.blueprints/**'],
    environment: 'jsdom',
    globals: true,
  },
  run: {
    tasks: {
      'start-js': {
        command: 'craco start',
        cache: false,
      },
      'start-js-nm': {
        command: 'GENERATE_SOURCEMAP=false craco start',
        cache: false,
      },
      'watch-css': {
        command: 'postcss src/app/css/main.css -o public/index.css -w',
        cache: false,
      },
      'watch-sw': {
        command: 'tsc -p ./swSrc -w',
        cache: false,
      },
      'build-css': {
        command: 'postcss src/app/css/main.css -o public/index.css',
      },
      'build-sw': {
        command: 'tsc -p ./swSrc',
      },
      'build-js': {
        command: 'craco build',
        dependsOn: ['build-css', 'build-sw'],
      },
    },
  },
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
  staged: {
    '*': 'vp check --fix',
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
