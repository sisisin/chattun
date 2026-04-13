# Task: typescript 6でdeprecation warnが出ている部分を修正する

## 原文

- Task: typescript 6でdeprecation warnが出ている部分を修正する
  - 大規模になる場合、スコープごとにTaskを切り出して対応する形でも可

## 調査結果

TypeScript 6.0.2 環境で `tsc --noEmit` を実行し、TS5xxx 系の deprecation warning を確認したが、front/server ともに deprecation warning は**ゼロ**だった。

- `npx tsc -p front/tsconfig.json --noEmit 2>&1 | grep "TS5"` → 出力なし
- `npx tsc -p server/tsconfig.json --noEmit 2>&1 | grep "TS5"` → 出力なし

front/tsconfig.json には `esModuleInterop`, `allowSyntheticDefaultImports` 等の TS6 でデフォルト化されたオプションが明示的に指定されているが、TS6 はこれらを明示しても warning を出さない。

## 結論

現時点で修正すべき deprecation warning は存在しない。タスクは達成済みとする。
