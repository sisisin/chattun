# Learnings: CRA → vite+ 移行

## 学び

- vite+ は `oxc` をトランスパイラとして使う。React 16 は jsx-runtime を持たないため `oxc: { jsx: { runtime: 'classic' } }` が必須
- `defineConfig` を関数形式 `defineConfig(({ mode }) => {...})` にすると oxlint が `lint` フィールドを見つけられない。オブジェクト形式を使い、`.env.local` の読み込みはトップレベルで `fs.readFileSync` で行う
- CRA が提供していた `jsdom` は推移的依存だったため、CRA 削除後は明示的に `yarn add -D jsdom` が必要
- `import.meta.dirname` は Node 22+ で利用可能。ESM 環境で `__dirname` の代替として使える
- README のドキュメントとコードが参照する環境変数名は一致させる必要がある。レビューで2回指摘を受けた

## 仕組みとして解決できそうなこと

特になし（既存 Task でカバー済み）
