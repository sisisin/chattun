# Task: TweetContent上で `>` が `&gt` になるのを修正

## 原文

- Task: TweetContent上で `>` が `&gt` になるのを修正
  - 再現json: tmp/examples/message-gt.json

## 分析

Slack の `text` フィールドでは `>`, `<`, `&` が HTML エンティティ (`&gt;`, `&lt;`, `&amp;`) としてエンコードされている。
mrkdwn パーサー (`parser.ts`) がこれらをデコードしていないため、`&gt;` がそのまま表示される。

## 修正方針

パーサーの `text` ノード生成時（plain text 部分）で `&gt;`, `&lt;`, `&amp;` をデコードする。
`<...>` 構文の内部テキストは Slack が既にデコード済みなのでそのままでよい。

## 達成条件

- `&gt;` が `>` として表示される
- `&lt;` が `<` として表示される
- `&amp;` が `&` として表示される
- 既存のテスト（パーサーテスト37件）が全パスする
- 上記のデコードに対するテストが追加されている

## 検証ステップ

- [x] review
- [x] browser-verification
