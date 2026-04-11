# Learnings

## React 16 + Vite/OxcのJSX設定

- tsconfig.jsonの`"jsx": "preserve"`はviteのimport解析でパースエラーを起こす
- React 16にはjsx-runtimeがないため、oxcのjsx設定は`{ runtime: 'classic' }`にする必要がある（`automatic`だと`react/jsx-dev-runtime`の解決に失敗）
- vite-plusでは`esbuild`と`oxc`の両方が設定されるとoxcが優先される。vite-plusはデフォルトでoxcを使うため、`esbuild`オプションは無視される

## vite.config.tsのESM互換性

- oxlintがvite.config.tsをESMとしてロードするため、`__dirname`は使えない。`import.meta.dirname`（Node.js 22+）を使う

## Vitest configDefaults

- `test.exclude`をカスタム設定するとデフォルト値（`node_modules`, `.git`等）が上書きされる。`configDefaults.exclude`をspreadして追加するのが正しい
