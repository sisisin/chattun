# Task: リストのインデントが解釈されていない

## Task定義（原文）

> リストのインデントが解釈されていない
>   - slack: https://knowledge-work.slack.com/archives/C08BGCC754L/p1776215037703899 , msg: tmp/examples/message-slack-attachment.json

## 解釈

### 問題

BlockKitRenderer の `rich_text_list` 要素は `indent` フィールド（0, 1, 2 等）を持つが、現在はすべて同じインデントレベルで描画されている。Slack のデータ構造ではネストされたリストではなくフラットな配列で indent レベルが指定される。

### 達成条件

1. `rich_text_list` の `indent` フィールドに応じて視覚的にインデントする
2. indent=0 はインデントなし、indent=1 は1段階、indent=2 は2段階のインデント
3. Slack の表示に近づける（bullet スタイルの変化: disc → circle → square）

### スコープ

- `BlockKitRenderer.tsx` — `rich_text_list` のレンダリングに indent 対応を追加
