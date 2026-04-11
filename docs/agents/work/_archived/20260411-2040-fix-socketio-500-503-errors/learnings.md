# Learnings

## Cloud Run の exit(1) とインスタンスライフサイクル
- Node.js の unhandled rejection はデフォルトで exit(1) を引き起こす（v15以降）
- Cloud Run では exit(1) → インスタンス再起動 → 再起動中のリクエストが503 という連鎖が発生する
- `gcloud logging read` で `run.googleapis.com/varlog/system` を見ると `Container called exit(1)` やインスタンス起動理由が確認できる

## unhandledRejection ハンドラの配置
- `process.on('unhandledRejection')` はトップレベルに配置すべき。main() 内だと起動処理中のrejectionを捕捉できない
- Cloud Run のような環境ではプロセスを終了させない方が望ましいが、その設計判断はコメントで明記すべき
