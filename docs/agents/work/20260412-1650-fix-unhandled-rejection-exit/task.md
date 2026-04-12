# Task: unhandledRejectionでプロセス終了するように直す

## 達成条件

- unhandledRejectionハンドラーがログ出力後にprocess.exit(1)すること
- vp checkが通る

## 背景

現在のunhandledRejectionハンドラーはログだけ出して握りつぶしている。
握りつぶすのは悪なので、uncaughtExceptionと同様にプロセスを終了させる。
