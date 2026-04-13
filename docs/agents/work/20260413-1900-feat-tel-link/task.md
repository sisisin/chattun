# Task: TweetContentで電話番号がリンクになっていない

## 原文

- Task: TweetContentで電話番号がリンクになっていない
  - tmp/examples/message-tel-link.json

## 分析

- Slack の mrkdwn で `<tel:xxx|xxx>` 形式の電話番号リンクがある
- パーサーの `parseAngleBracket` でリンク判定が `://` か `mailto:` のみで `tel:` スキームに対応していない
- 修正: `tel:` スキームもリンクとして認識するよう条件追加

## 達成条件

- `<tel:xxx|xxx>` 形式がリンクとしてパースされる
- `<tel:xxx>` 形式（テキストなし）もリンクとしてパースされる
- テストが追加されている

## 検証ステップ

- [ ] review
- [ ] browser-verification
