# Task: pnpm workspaceのlockfileをrootに統合する

## 背景

現在 `.npmrc` に `shared-workspace-lockfile=false` を設定しており、front/server それぞれに個別の `pnpm-lock.yaml` を持っている。
この構成だとルートから `vp run -r` を実行した際にワークスペースパッケージの依存（jsdom 等）がルートの node_modules で解決できず失敗する。
ルート起点でのワークスペース統合運用（vp run -r, vp staged 等）を実現するために、lockfile をルートに統合する。

## 達成条件

1. `.npmrc` から `shared-workspace-lockfile=false` を削除
2. front/pnpm-lock.yaml, server/pnpm-lock.yaml を削除し、ルートに単一の pnpm-lock.yaml を生成
3. `pnpm install` が正常に完了する
4. `cd front && pnpm vp run test-all` が通る（check + test）
5. `cd server && npx tsc --noEmit` が通る
6. Docker ビルドが通る（front/server 個別の lockfile 前提の Dockerfile を修正）
7. CLAUDE.md の前提記述を更新

## スコープ

- lockfile 統合と、それに伴う .npmrc / Dockerfile / CLAUDE.md の修正
- front/server の個別 lockfile 削除
- .gitignore の調整（ルートの pnpm-lock.yaml を追跡する）
