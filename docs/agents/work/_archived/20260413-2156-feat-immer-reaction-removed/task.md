# Task: onReactionRemoved の reduce+spread を Immer 直接操作に書き換える

## 原文

- Task: onReactionRemoved の reduce+spread を Immer 直接操作に書き換える
  - slack/module.ts:187-211 でドラフト内にも関わらず reduce+spread でコピーしている。findIndex+splice の直接操作にする

## 修正方針

現在の `reduce + [...acc, curr]` パターンを、Immer ドラフト上の直接操作（findIndex → splice / 直接プロパティ変更）に書き換える。
onReactionAdded (155-172行) が既に findIndex+splice パターンを使っているので、それと一貫したスタイルにする。

ロジック:
1. 該当リアクション名を findIndex で見つける
2. 見つからない or ユーザーが含まれていない → 何もしない
3. count === 1 → splice で削除
4. count > 1 → count を減らし、users から該当ユーザーを除去

## 達成条件

- reduce+spread を直接操作に置き換え
- onReactionAdded と一貫したスタイル
- lint / type-check が通る

## 検証ステップ

- [x] review
- [x] browser-verification
