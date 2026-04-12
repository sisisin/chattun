import { configDefaults, defineConfig } from 'vite-plus';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import autoprefixer from 'autoprefixer';
import type { Plugin } from 'vite';

function swPlugin(): Plugin {
  const compile = () => execSync('tsc -p ./swSrc', { stdio: 'inherit' });
  return {
    name: 'sw-compile',
    buildStart() {
      compile();
    },
    configureServer(server) {
      compile();
      server.watcher.add(path.resolve(import.meta.dirname, 'swSrc'));
      server.watcher.on('change', file => {
        if (file.includes('swSrc')) {
          compile();
        }
      });
    },
  };
}

const envLocal = fs.existsSync('.env.local')
  ? Object.fromEntries(
      fs
        .readFileSync('.env.local', 'utf-8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(s => s.trim())),
    )
  : {};

const defaultCert = path.resolve(import.meta.dirname, '../tmp/fullchain.pem');
const defaultKey = path.resolve(import.meta.dirname, '../tmp/privkey.pem');

const certFile = envLocal.SSL_CRT_FILE || (fs.existsSync(defaultCert) ? defaultCert : undefined);
const keyFile = envLocal.SSL_KEY_FILE || (fs.existsSync(defaultKey) ? defaultKey : undefined);

if ((certFile && !keyFile) || (!certFile && keyFile)) {
  throw new Error(
    `HTTPS config incomplete: cert=${certFile ?? 'missing'}, key=${keyFile ?? 'missing'}. Both are required.`,
  );
}

const https =
  certFile && keyFile
    ? { cert: fs.readFileSync(certFile), key: fs.readFileSync(keyFile) }
    : undefined;

export default defineConfig({
  plugins: [swPlugin()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
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
    global: 'globalThis',
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
      build: {
        command: 'vp build',
      },
      'move-assets': {
        command: 'rm -rf ../server/public && mkdir -p ../server && mv build ../server/public',
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
              name: '@tanstack/react-router',
              importNames: ['useLocation', 'useParams', 'useNavigate'],
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
