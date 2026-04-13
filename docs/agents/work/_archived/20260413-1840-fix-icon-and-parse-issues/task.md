# Task: アイコンのリンク切れ・本文のパースに一部失敗

## 原文

- Task: アイコンのリンク切れ・本文のパースに一部失敗
  - 再現json: tmp/examples/message-linkmissing.json , tmp/examples/message-linkmissing2.json
  - linkmissing2の元メッセージURL: https://knowledge-work.slack.com/archives/C044DHKG5GF/p1776068105261909

## 分析

### アイコンのリンク切れ
- bot_message で `icons` フィールドがない場合、`iconUrl` が空文字 `""` になる
- `<img src="">` がリンク切れとして表示される
- 修正: `iconUrl` が空の場合にデフォルトアイコンまたは非表示にする

### 本文パースの一部失敗
- `<#C01168W64LD>` のようにパイプ (`|`) なしのチャンネル参照をパーサーが処理できない
- `parseAngleBracket` が `#` で始まってもパイプがないと null を返し、角括弧ごとテキストになる
- 修正: パイプなしのチャンネル参照も `channel_ref` ノードとして処理する

## 達成条件

- `iconUrl` が空の場合にデフォルトアイコンが表示される（リンク切れにならない）
- `<#CID>` 形式（パイプなし）のチャンネル参照がパースされる
- テストが追加されている

## 検証ステップ

- [x] review
- [x] browser-verification
