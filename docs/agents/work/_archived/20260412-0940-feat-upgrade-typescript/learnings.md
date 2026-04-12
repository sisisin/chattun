# Learnings

## TS6のbaseUrl非推奨

- TS6で`baseUrl`が非推奨。`paths`マッピングに移行が必要
- `baseUrl: "src"`で`app/...`と書いていた場合、`paths: { "app/*": ["./src/app/*"] }`に置換

## pnpm strict resolution と型参照

- pnpmのstrict node_modules構造では、直接依存でないパッケージの型が解決できない
- `vite/client`の`/// <reference types>`はviteが直接依存でないと効かない→viteをdevDependenciesに追加
- `@types/history@5`は中身が空（deprecatedで型なし）。history@4を使っている場合は`@types/history@4`が必要

## moduleResolution: bundler

- viteプロジェクトでは`moduleResolution: "bundler"`が推奨
- `"node"`はTS6で`"node10"`扱いとなり非推奨警告が出る
- `module: "preserve"`との組み合わせが自然

## test-allに型チェック

- `vp check`はfmt + lint + type-checkの一括実行
- `test-all`で個別に`vp fmt --check && vp lint`としていたため型チェックが漏れていた
- `vp check && vp test run`に変更することで型チェックも含まれるようになった
