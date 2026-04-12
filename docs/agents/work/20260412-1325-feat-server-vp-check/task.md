# Task: serverでvp checkを利用する

## 背景

front では vp check（fmt + lint + type-check 一括実行）を活用しているが、server にはこの仕組みがない。
server にも vite.config.ts を追加して vp check を利用できるようにし、コード品質を統一する。

## 達成条件

1. server/vite.config.ts を作成（fmt, lint 設定）
2. `cd server && pnpm vp check` が通る
3. server の ci script を `vp check` に変更（型チェックに加え fmt+lint も CI で実行）
4. ルートの staged 設定に server も追加
5. `pnpm vp run -r ci` が通る
6. Docker ビルドが通る

## スコープ

- server/vite.config.ts 作成
- server/package.json の ci script 更新
- ルート vite.config.ts の staged 設定に server 追加
- CLAUDE.md 更新（サーバーコマンド追加）
