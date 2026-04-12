# Task: @slack/oauthを3.xにアップデートする

## 達成条件

- @slack/oauth を 2.2.0 → 3.x (最新) にアップグレード
- APIの破壊的変更への対応（2→3はNode.js 18+要求と内部依存更新のみ）
- vp checkが通る

## 背景

サーバーモダナイズの一環。@slack/oauth 3.xは内部で@slack/web-api v7と@slack/logger v4を使用。
Node.js 22を使用しているため、最小バージョン要件は満たしている。
