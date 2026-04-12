# Task: Hono移行後のOAuth認証フローが「OAuth failed」になる問題を修正する

## 達成条件

- Slack OAuth認証が正常に動作すること
- handleCallbackのエラーが適切にログ出力されること
- vp checkが通る

## 背景

Hono移行後、デプロイされたアプリでSlack OAuth認証を行うと「OAuth failed」が表示される。
handleCallbackのfailureコールバックにエラーログがないため原因特定が困難。
