# Task: attachment内のリンクやメンションが解決されていないのを修正

## Task定義（原文）

> attachment内のリンクやメンションが解決されていないのを修正
>   - tmp/examples/message-attachment.json , tmp/examples/message-slack-attachment.json

## 解釈

### 問題

AttachmentView の `text` / `pretext` フィールドは Slack mrkdwn 形式のテキストを含むが、現在は plain text として `<div>` に表示しているため、`<@U...>` メンションや `<https://...>` リンク、`:emoji:` がそのまま表示される。

### 達成条件

1. AttachmentView の `text` と `pretext` を `MrkdwnContent` でレンダリングし、リンク・メンション・絵文字を正しく解決する
2. 既存のメッセージ本文と同様に `ResolveContext` を通じてユーザー名やチャンネル名が解決される

### スコープ

- `TweetContent.tsx` — `AttachmentView` 内の text/pretext 表示を `MrkdwnContent` に変更

## 検証ステップ

- [x] review
- [x] browser-verification (BLOCKED — 自己署名証明書でChrome接続不可、スキップ)
