# Task: expressをhonoに移行する

## 達成条件

- express, express-session, connect-redis, helmet をhonoおよびhono標準/互換のミドルウェアに置き換える
- @types/express, @types/express-session, @types/connect-redis を削除する
- mock-serverも併せてhonoに移行する
- セッション管理（Redis Store, TTL 5日）が同等の機能を維持する
- セキュリティヘッダー（helmet相当）が維持される
- Socket.IOとの統合が維持される
- 全APIエンドポイントの動作が維持される
- SPAフォールバックが維持される
- vp checkが通る

## 背景

expressは古いフレームワークで、honoはモダンなWeb標準ベースのフレームワーク。
サーバーのモダナイズの一環としてhonoに移行する。

## スコープ

- server/src/ 配下のexpress依存コード
- server/mock-server/ 配下のexpress依存コード
- server/package.json の依存関係
- ロギングミドルウェア（express.Request → hono Context への移行）
- Slack OAuth フロー（req/res → hono Context への移行）
