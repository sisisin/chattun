# Task: 自分へのメンションがハイライトされるようにする

## 達成条件

- タイムライン上で自分宛てのメンション（@自分の名前）が視覚的にハイライトされる
- @channel, @here もハイライトされる

## 背景

Slack上で自分にメンションされたメッセージが通常のメッセージと同じように見えて気づきにくい。

## スコープ

- `toMention` に自分のuserIdを渡して自分へのメンションを `<span class="mention-self">` で囲む
- `textToHtml` に userId を渡す
- `slackMessageToTweet` で profile.userId を `textToHtml` に渡す
- CSSでハイライトスタイルを追加

## 検証ステップ

- [x] review
- [x] browser-verification
