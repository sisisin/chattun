# 調査結果

## 問題1: stderrへの非構造化エラーログ

### 原因
`ErrorWithLogContext` がunhandled rejectionとしてstderrに出力されている。
Cloud Loggingでは各行が個別の `textPayload` として記録され、構造化ログとして扱われない。

### 発生箇所
1. `io.ts:23` — `logger.withContext()` の戻り値(Promise)がawaitされていない。内部でエラーが発生するとunhandled rejectionになる
2. `slack.ts:123` — `socket.data.sessionProfile` が undefined のソケットで `.userId` にアクセスし TypeError

### 修正方針
- `io.ts` の `logger.withContext` をawaitではなく `.catch` でハンドルする（即座に返す必要があるため）
- `slack.ts:123` で `sessionProfile` が undefined のソケットをフィルタする

## 問題2: Socket.IO WebSocket 500/503エラー

### 原因推定
- 503: Cloud Runインスタンスが起動途中でリクエストを受けた、またはインスタンスの接続エラー
- 500: アプリケーション内のunhandled rejectionによりプロセスが不安定になった可能性

### 修正方針
- unhandled rejectionを解消することで500エラーも軽減される見込み
- 認証なしソケットを適切にdisconnectすることで不正な状態のソケットを排除
