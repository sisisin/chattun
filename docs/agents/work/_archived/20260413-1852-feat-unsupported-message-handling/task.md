# Task: 未対応メッセージの対応

## 原文

- Task: 未対応メッセージの対応
  - tmp/examples/message-unsupported.json , tmp/examples/message-unsupported2.json
  - あと、「対応してない」の表記、chattunからのものであるとわかるような表記にしたい

## 分析

### 未対応メッセージの正体
- 両方ともハドル（huddle）関連メッセージ
- `text: ""` で `room` フィールドにハドル情報がある
- `room.call_family === "huddle"` で判定可能

### 修正内容
1. **ハドルメッセージの表示**: `room` フィールドを型定義に追加し、ハドルメッセージを「ハドルが開始されました」と表示
2. **未対応メッセージの表記改善**: `[chattun]` プレフィックスを付けてchattunからの表示であることを明示

### 変更ファイル
- `SlackEntity.d.ts`: `Basic` に `room?` と `permalink?` フィールド追加、`subtype` を `string` に拡張
- `timeline/interface.ts`: `Tweet` に `isHuddle` フラグ追加
- `slack/selector.ts`: `slackMessageToTweet` で `isHuddle` を設定
- `TweetContent.tsx`: ハドルメッセージの表示分岐追加、未対応メッセージに `[chattun]` プレフィックス追加
- `Tweet.module.css`: ハドル表示用スタイル追加

## 達成条件

- ハドルメッセージが「ハドルが開始されました」と表示される
- 未対応メッセージの表記がchattunからのものとわかる
- 既存のテストがパスする

## 検証ステップ

- [x] review
- [x] browser-verification
