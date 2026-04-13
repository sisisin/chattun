# Task: typescript 6でdeprecation warnが出ている部分を修正する

## 原文

- Task: typescript 6でdeprecation warnが出ている部分を修正する
  - 大規模になる場合、スコープごとにTaskを切り出して対応する形でも可

## 調査結果

`front/swSrc/tsconfig.json` に `"ignoreDeprecations": "6.0"` が設定されており、deprecation warning が抑制されていた。
抑制を外すと以下の2件が発生：

1. **TS5107**: `moduleResolution: "node"` (node10) が非推奨
2. **TS5101**: `outFile` が非推奨

## 修正内容

- `moduleResolution: "node"` → `"bundler"` に変更
- `outFile: "../public/sw.js"` → `outDir: "../public/"` に変更（入力が sw.ts 1ファイルのみなので出力パスは同じ）
- `module: "es2022"` を明示（`moduleResolution: "bundler"` に対応）
- `ignoreDeprecations: "6.0"` を削除
- `esModuleInterop`, `allowSyntheticDefaultImports` を削除（TS6 でデフォルト化済み）

## 達成条件

- `ignoreDeprecations` なしで `tsc -p swSrc/tsconfig.json` がエラー/warning なしで通る
- 出力 `public/sw.js` の内容が変わらない
