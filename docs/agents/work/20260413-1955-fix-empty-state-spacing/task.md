# Task: まだ投稿がありませんのときのアイコンがヘッダ部分との隙間がなくなってしまっているのを修正

## 原文

- Task: まだ投稿がありませんのときのアイコンがヘッダ部分との隙間がなくなってしまっているのを修正
  - tmp/examples/image copy.png

## 解釈・スコープ

### 背景

投稿が0件の場合に表示される空状態画面で、chattunロゴがヘッダーバーの直下に隙間なく表示されてしまっている。
スクリーンショット（tmp/examples/image copy.png）で確認すると、「すべての投稿」ヘッダとロゴの間にスペースがない。

### 原因

- Menu は `position: fixed` でヘッダを固定
- Menu.module.css の `& + div` で `padding-top: var(--spacing-2xl)` を付与しているが
- `.tweetlist-empty` は `height: 100vh` + `padding: 20vh 0 30vh` で指定
- `height: 100vh` だとビューポート全体を使い、固定ヘッダ分のオフセットと合わせるとロゴが上に詰まって見える

### 達成条件

1. 空状態のロゴとヘッダの間に適切なスペースが確保される
2. ThreadView の空状態も同様に修正（同じCSSクラスを使用している場合）
