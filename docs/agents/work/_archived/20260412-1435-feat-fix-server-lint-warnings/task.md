# Task: serverのlint warningを解消する

## 背景

vp check導入後、serverに7件のlint warningが残っている。

## 達成条件

1. `cd server && pnpm vp check` が warning 0件で通る
2. 既存の動作を壊さない

## スコープ

- io.ts: 未使用import（AppsEventAuthorizationsListResponse, webClient, socketClient）を削除
- logging/logger.ts: setNameのパラメータをアンダースコアプレフィックスに
- index.ts: /api/fooと/api/errのデバッグエンドポイントを削除
- utils.ts: unsafe optional chainingの修正
