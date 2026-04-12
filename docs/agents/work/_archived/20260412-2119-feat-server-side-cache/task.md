# Task: channels listやらをサーバー側でキャッシュ

## 達成条件

- emoji.list, users.list, conversations.list, team.info のSlack API呼び出し結果がRedisにキャッシュされる
- 同じデータが要求された場合、Slack APIではなくRedisから返される
- 適切なTTLが設定されている（5分）

## 背景

毎回クライアントが接続するたびに4つのSlack APIを呼んでいるのが無駄。Redisは既に使われている。

## スコープ

- `server/src/cache.ts` を新規作成しキャッシュユーティリティを実装
- `server/src/index.ts` の4つのGETエンドポイントにキャッシュを適用
- conversations.listはユーザー固有(is_member)のためユーザーID単位、他はワークスペース共通でキャッシュ

## 検証ステップ

- [x] review
