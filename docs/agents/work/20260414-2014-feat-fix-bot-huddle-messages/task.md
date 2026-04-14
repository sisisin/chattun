# Task: botの投稿やハドル開始メッセージでいろいろなものを解決できていないのを修正

## 原文

- Task: botの投稿やハドル開始メッセージでいろいろなものを解決できていないのを修正
  - アイコン・投稿リンクが死んでる。多分bot messageだとbot profile取りに行く必要があるのではないか。
  - slack url: https://knowledge-work.slack.com/archives/C03AC1TQJCQ/p1776087230167729 , tmp/examples/message-bot.json
  - tmp/examples/message-huddle.json

## 調査結果

### bot message

**問題1: アイコンが表示されない**
- `getMessageProfile` (timeline/selector.ts:24) は `msg.user` で `users` マップを引くが、bot_message には `user` フィールドがない
- フォールバックで `msg.icons?.image_48` を見るが、Socket Mode で受信した bot_message には `icons` が付かないケースがある
- Slack API の bot_message には `bot_profile` が含まれる場合があり、そこに `icons.image_48` がある

**問題2: Slack リンクが生成されない (deepLinking: 'directly' の場合)**
- `getSlackLink` は `getTeamId(msg)` で `msg.team` を取得するが、bot_message には `team` がない
- `viaBrowser` モードでは `profile.domain` ベースのURLなので問題なし

### huddle message

- ハドルメッセージには `permalink` フィールドがある（例: `https://knowledge-work.slack.com/call/R0ATK1BEZCG`）
- 現在はこれが使われていない

## 修正方針

1. `SlackEntity.d.ts` に `bot_profile` 型を追加
2. `getMessageProfile` を拡張: `msg.bot_profile?.icons?.image_48` をフォールバックに追加
3. `getTeamId` を拡張: bot_message 等で `team` がない場合、SlackState から teamId を取得するルートを追加
4. ハドルメッセージの `permalink` を slackLink として利用

## 達成条件

- bot message のアイコンが `bot_profile` から取得される
- bot message の Slack リンクが生成される
- ハドルメッセージのリンクが permalink を使用する
- lint / type-check が通る
