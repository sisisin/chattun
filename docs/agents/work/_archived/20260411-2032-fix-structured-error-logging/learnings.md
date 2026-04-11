# Learnings

## logger.withContext の Promise ハンドリング
- `logger.withContext` は Promise を返すが、呼び出し元で await/catch しないと内部エラーが unhandled rejection になる
- Socket.IO の connection ハンドラのような同期コールバック内では `.catch()` でハンドルする
- async 関数内では `await` で呼ぶことで `handlerError` 等の catch チェーンに伝播させる

## ErrorWithLogContext の扱い
- `handlerError` 等のエラーハンドラでは `ErrorWithLogContext` を `unwrapAndGetContext()` して構造化ログに含めるべき
- そうしないとコンテキスト情報（channel, ts, eventType等）がログから失われる

## Cloud Run のログ出力
- stdout に `console.log(JSON.stringify(...))` で出力したものは Cloud Logging で構造化ログとして扱われる
- stderr に出力された非構造化テキスト（unhandled rejection のスタックトレース等）は各行が個別の `textPayload` になり、検索・集約が困難
