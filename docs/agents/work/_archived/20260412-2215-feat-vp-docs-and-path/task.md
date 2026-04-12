# Task: pnpm installとかpnpm runをドキュメントからなくし、vpを利用することを前提に修正する

## 達成条件

- CLAUDE.md / README.md / skill / command 内の `pnpm vp` → `vp` に置換されていること
- `pnpm install` → `vp install` に置換されていること
- `pnpm start` (front) → `vp dev` に置換されていること
- サーバーのnpm script (`pnpm dev`, `pnpm dev:mock`, `pnpm run ci`) はvp化されていないため pnpm のまま
- mise.toml の `_.path` に `node_modules/.bin` を追加して、vp が直接使えること

## 背景

`pnpm vp` と毎回打つのが冗長。mise.toml の `_.path` で `node_modules/.bin` をPATHに追加すれば `vp` が直接使える。
ドキュメント上も `vp` を標準コマンドとして記載する。

## スコープ

- mise.toml に `node_modules/.bin` をPATH追加
- CLAUDE.md, README.md, skill, command の pnpm → vp 置換

## 検証ステップ

- [x] review
