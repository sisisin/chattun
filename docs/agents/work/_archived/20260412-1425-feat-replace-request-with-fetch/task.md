# Task: requestパッケージをNode.js標準のfetchに置き換えて削除する

## 背景

`request`パッケージは2020年にdeprecated。Node.js 22にはネイティブfetchがあるため置き換え可能。

## 達成条件

1. `/api/file`エンドポイントのSlackファイルプロキシをfetchに置き換える
2. `request`と`@types/request`をpackage.jsonから削除
3. `pnpm vp run -r ci`が通る
4. Dockerビルドが通る

## スコープ

- server/src/index.ts の `/api/file` エンドポイント修正
- server/package.json から request, @types/request を削除
