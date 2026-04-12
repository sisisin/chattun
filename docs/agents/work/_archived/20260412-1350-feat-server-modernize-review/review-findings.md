# Server モダナイズレビュー結果

## 1. 依存関係のアップデート

### 破壊的変更あり（メジャーアップデート）
- **express 4.17.1 → 5.x**: Express 5は大きなAPI変更あり。req.query、エラーハンドリング等
- **connect-redis 4.0.4 → 9.x**: v7+でAPIが大幅に変わっている（connectRedis(session)パターン廃止、new RedisStore直接化）
- **ioredis 4.27.7 → 5.x**: メジャーアップデート。@types/ioredisが不要に（v5で型同梱）
- **helmet 4.6.0 → 8.x**: デフォルトのセキュリティヘッダーが変更
- **@slack/oauth 2.2.0 → 3.x**: インストールフローのAPI変更

### マイナー/パッチアップデート
- @slack/socket-mode 2.0.4 → 2.0.6
- express-session 1.17.0 → 1.19.0
- socket.io 4.7.5 → 4.8.3
- ts-node 10.2.0 → 10.9.2
- nodemon 2.0.12 → 3.x

### deprecated パッケージ
- **request 2.88.2**: 2020年にdeprecated。Node.js標準のfetchまたはundiciに置き換え可能

### 不要な @types パッケージ
- **@types/ioredis**: ioredis v5に型が同梱されるので不要になる（ioredisアップデート時）
- **@types/connect-redis**: connect-redis v7+に型が同梱されるので不要になる

## 2. tsconfig.json

- `"module": "commonjs"`: ts-nodeでCJSとして実行しているため現状は妥当
- tsconfig全般は概ね問題ない

## 3. コード品質の問題

### 未使用のインポート/変数（lint warningで検出済み）
- io.ts: `AppsEventAuthorizationsListResponse`, `webClient`, `socketClient` が未使用
- logging/logger.ts: `setName(name: string)` のパラメータ `name` が未使用
- index.ts: `/api/err`エンドポイントの`req`, `res`が未使用
- utils.ts: unsafe optional chaining

### デバッグ/テスト用エンドポイント
- `/api/foo`: デバッグログ確認用のテストエンドポイント
- `/api/err`: エラーテスト用エンドポイント
- これらは開発専用コードで、本番に残すべきではない

### セキュリティ
- `middleware.ts`: セッションシークレットがハードコード（`'abkl;aew'`）
- `slack.ts`: stateSecret がハードコード（`'my-state-secret'`）
- `middleware.ts`: helmet の CSP が `false`（`// todo: ちゃんとする` コメント）

### requestパッケージの使用
- `index.ts`: `/api/file`エンドポイントで`request`パッケージを使用してSlackファイルをプロキシ
- Node.js標準の`fetch`で置き換え可能

### hardcoded ユーザーID
- `slack.ts`: `logTarget` SetにハードコードされたSlackユーザーID（`U05V1TFDXAM`, `U011CM1HRHV`）

## 4. nodemon

- nodemon 2.x → 3.x: メジャーアップデートだが互換性が高い
- 代替として tsx --watch も検討可能だが、ts-node使用中なので現状維持でOK
