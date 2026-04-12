import { configDefaults, defineConfig } from 'vite-plus';
import fs from 'fs';
import path from 'path';

const envLocal = fs.existsSync('.env.local')
  ? Object.fromEntries(
      fs
        .readFileSync('.env.local', 'utf-8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(s => s.trim())),
    )
  : {};

const https =
  envLocal.SSL_CRT_FILE && envLocal.SSL_KEY_FILE
    ? { cert: fs.readFileSync(envLocal.SSL_CRT_FILE), key: fs.readFileSync(envLocal.SSL_KEY_FILE) }
    : undefined;

export default defineConfig({
  oxc: {
    jsx: { runtime: 'classic' },
  },
  resolve: {
    alias: {
      app: path.resolve(import.meta.dirname, 'src/app'),
    },
  },
  define: {
    'process.env': '{}',
  },
  server: {
    port: 3000,
    host: envLocal.HOST || undefined,
    https,
    proxy: {
      '/api': { target: 'http://localhost:3100', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:3100', ws: true, changeOrigin: true },
    },
  },
  build: {
    outDir: 'build',
  },
  test: {
    exclude: [...configDefaults.exclude, '.blueprints/**'],
    environment: 'jsdom',
    globals: true,
  },
  run: {
    tasks: {
      'start-js': {
        command: 'vp dev',
      },
      'watch-css': {
        command: 'postcss src/app/css/main.css -o public/index.css -w',
      },
      'watch-sw': {
        command: 'tsc -p ./swSrc -w',
      },
      'build-css': {
        command: 'postcss src/app/css/main.css -o public/index.css',
      },
      'build-sw': {
        command: 'tsc -p ./swSrc',
      },
      'build-js': {
        command: 'vp build',
        dependsOn: ['build-css', 'build-sw'],
      },
      'move-assets': {
        command: 'rm -rf ../server/public && mkdir -p ../server && mv build ../server/public',
      },
      format: {
        command: 'vp fmt --write && vp lint --fix',
      },
      'format-check': {
        command: 'vp fmt --check && vp lint',
      },
      'test-all': {
        command: 'vp check && vp test run',
      },
      g: {
        command: 'plop feature',
      },
      gm: {
        command: 'plop module',
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
