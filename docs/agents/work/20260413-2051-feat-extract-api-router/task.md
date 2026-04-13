# Task: serverのindex.tsがゴチャ付いてるので整理したい

## 原文

- Task: serverのindex.tsがゴチャ付いてるので整理したい。少なくとも`/api/*` は分けたい
  - src/router/とか切ってapiRouter変数をexportしてindex.tsでuseするとか

## 解釈

server/src/index.ts に OAuth ルート、認証済み API ルート、Slack プロキシ、ファイルプロキシが全部詰まっている。`/api/*` のルートを `src/router/api.ts` に分離し、index.ts では `app.route('/api', apiRouter)` で組み込む。

## 達成条件

- `/api/*` ルートが `src/router/api.ts` に分離されている
- index.ts は app 初期化、ミドルウェア、サーバー起動のみ担当
- 動作が変わらない（CI が通る）

## スコープ

- `src/router/api.ts` を作成し、全 `/api/*` ルートを移動
- index.ts でルーターを組み込む
