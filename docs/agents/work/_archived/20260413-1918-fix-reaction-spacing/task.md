# Task: リアクション表示の間隔調整

## 原文

- Task: リアクション表示がアクションボタンとの間が広すぎる・TweetContentとの間が狭すぎる。逆ぐらいがちょうど良さそうにみえる

## 分析

### 現状
- `.tweet-actions-list-emojis` の `padding: var(--spacing-xs) 0` で上下同一
- `margin-bottom: var(--spacing-sm)` でアクションボタンとの間隔が広い

### 修正
- `padding` を `var(--spacing-sm) 0 var(--spacing-xs)` に変更（上を広く、下を狭く）
- `margin-bottom` を削除

## 達成条件

- TweetContentとリアクションの間が広くなる
- リアクションとアクションボタンの間が狭くなる

## 検証ステップ

- [x] review
- [x] browser-verification
