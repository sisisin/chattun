# 調査結果: Socket.IO 500/503エラー

## 時系列分析

```
07:05:19 [stdout] user connected x4 + sessionProfile not found x1
07:05:20 [stderr] ErrorWithLogContext (userId undefined, retry_num:1, retry_reason:timeout)
07:05:21 [stderr] ErrorWithLogContext (userId undefined, retry_num:0)
07:05:25 [stdout] server running on :::8080  ← 新しいインスタンス起動
07:05:25 [stdout] user connected x3 + sessionProfile not found x1
07:05:26 [stderr] ErrorWithLogContext (retry_num:1, retry_reason:timeout)
07:05:31 [stdout] server running on :::8080  ← さらに別インスタンス起動
07:05:31 [stdout] server running on :::8080  ← さらに別インスタンス起動
07:05:31 [stdout] user connected x3 + sessionProfile not found x1
07:05:34 [stderr] ErrorWithLogContext (reaction_added, retry_num:0)
07:05:42 [stdout] user connected (遅延接続)
```

## 原因分析

### 500エラー
Cloud Runのリクエストログ上の500はアプリケーション内のunhandled rejection（`ErrorWithLogContext`）が原因。
Task 1の修正（sessionProfileのnullチェック、withContextのawait、handlerErrorでのErrorWithLogContext対応）で解消済み。

### 503エラー ("malformed response or connection error")
時系列から、**Cloud Runのインスタンスが短時間に複数起動**しているのが見える。
503は既存インスタンスがシャットダウン中に新しいWebSocket接続を受けた際に発生していると推定。

考えられるシナリオ:
1. Cloud Runのオートスケーリングで新インスタンスが起動
2. 古いインスタンスへのWebSocket接続がリバランスされる際にコネクションが切断
3. WebSocketアップグレード途中でインスタンスが応答不能 → 503

### sessionProfile not found の原因
各インスタンス起動後に必ず1つ「sessionProfile not found」が出ている。
これはCloud Runの新インスタンスではRedisセッションは共有だが、Socket.IOの再接続時にセッションCookieが正しく送信されないクライアントが存在する可能性。

## 根本原因（確定）

Cloud Runシステムログにより判明:

```
07:04:28 Container called exit(1)
07:04:52 Container called exit(1)
07:05:15 Container called exit(1)
07:05:20 Container called exit(1)
07:05:34 Container called exit(1)
```

**unhandled rejection（ErrorWithLogContext）→ Node.jsがexit(1)でクラッシュ → Cloud Runが新インスタンスを起動 → 起動中のリクエストが503**

という連鎖。500もクラッシュ直前のリクエストが中断されたもの。

## 修正内容

1. `process.on('unhandledRejection')` でプロセスクラッシュを防止し、構造化ログに記録
2. `process.on('uncaughtException')` で同期的な例外も構造化ログに記録（こちらはexit(1)を維持）
3. `main().catch` も構造化ログ経由に変更

## 結論
- 500/503エラー共通: unhandled rejectionによるコンテナクラッシュが根本原因
- Task 1の修正でunhandled rejectionの発生自体を解消
- 本Task（Task 2）でセーフティネットとしてunhandledRejectionハンドラを追加し、万一の場合もプロセスをクラッシュさせない
- sessionProfile not found: 常に1クライアント分発生 → Task 3（未認証ソケットの通知）で対応
