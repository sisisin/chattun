# Task: typescriptなどの共通の依存をrootに移動

## 背景

pnpm workspace 統合後、front と server で重複している devDependencies がある。
共通のツール系依存をルートに移動し、各ワークスペースパッケージは自分固有の依存だけを持つようにする。

## 達成条件

1. 共通の devDependencies（typescript 等）をルート package.json に移動
2. front/server から移動した依存を削除
3. バージョンの統一（可能な範囲で）
4. `cd front && pnpm vp run test-all` が通る
5. `cd server && npx tsc --noEmit` が通る
6. Docker ビルドが通る

## 調査結果

### 現在の依存状況

**共通候補:**
- `typescript` — front: 6.0.2, server: 5.8.3（要統一）
- `@types/node` — front: 13.7.7（古い）, server: 22.19.17

### 方針

- typescript をルートに移動し、バージョン 6.0.2 に統一する（server を 5.8.3 → 6.0.2 に上げる）
- @types/node をルートに移動し、22.19.17 に統一する（front の 13.7.7 は古すぎ）
- vite, vite-plus をルートに移動する（次タスクの vp task化でルートから使うため）
- front 固有の依存（jsdom, plop 等）は front に残す
- server 固有の依存（nodemon, @types/express 等）は server に残す
