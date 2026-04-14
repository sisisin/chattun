# Task: messageのattachmentの解決してTweetContentに表示させる

## 原文

- Task: messageのattachmentの解決してTweetContentに表示させる

## 調査結果

### 現状

- `SlackEntity.Message.Basic` には `attachments` フィールドがない
  - `message?.attachments` はネストした `message_changed` イベント用
  - RTM で受信するメッセージ（bot_message 等）では `msg.attachments` として直接付く
- `SlackEntity.Attachment` 型は `fallback`, `image_url`, `original_url`, `[key: string]: any` のみ
- `imageAttachments` は `msg.message?.attachments` から `image_url` を持つものだけ抽出
- テキスト付き attachment（メッセージ unfurl 等）は表示されていない

### bot_message の attachment 例（tmp/examples/message-bot.json）

```json
{
  "text": "middleware directory の...",
  "author_name": "多久島 稔宏/...",
  "author_icon": "https://avatars.slack-edge.com/..._48.jpg",
  "fallback": "[April 13th] toshihiro...: middleware...",
  "from_url": "https://knowledge-work.slack.com/...",
  "is_msg_unfurl": true,
  "footer": "Slack の会話"
}
```

### 修正方針

1. `SlackEntity.Message.Basic` に `attachments?: SlackEntity.Attachment[]` を追加
2. `SlackEntity.Attachment` 型にテキスト attachment 用フィールドを追加（`text`, `author_name`, `author_icon`, `footer`, `pretext`, `title`, `title_link`, `color`）
3. `Tweet` 型に `attachments` フィールドを追加
4. `slackMessageToTweet` で `msg.attachments` を変換
5. `TweetContent` で attachment をレンダリング

## 達成条件

- テキスト付き attachment（メッセージ unfurl 含む）が TweetContent に表示される
- 画像 attachment の既存動作を維持
- lint / type-check が通る

## 検証ステップ

- [x] review
- [x] browser-verification
