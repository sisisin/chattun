# Task: メッセージがないときのアイコン表示の位置がおかしい

## 原文

- Task: メッセージがないときのアイコン表示の位置がおかしい。今日の昼過ぎ移行のcommitでおかしくなったはずなので、元の状態のcss/htmlの構造を把握してそれを反映するように修正して

## 解釈・スコープ

### 背景

CSS Modules移行（720dbdf）時の元のCSS:
```css
.tweetlist.is-empty {
  display: grid;
  height: 100vh;
  padding: 20vh 0 30vh;
}
```

先の修正（fix/empty-state-spacing）で以下に変更:
```css
.tweetlist-empty {
  display: grid;
  min-height: calc(100vh - var(--spacing-2xl) * 2);
  place-content: center;
  list-style: none;
}
```

元のデザインではロゴはやや上寄り（上20vh、下30vh）だったが、place-content: center で完全中央になっている。元のレイアウト意図を復元する必要がある。

### 達成条件

1. 元のCSSの意図（上20vh、下30vh によるやや上寄りの配置）を再現しつつ、ヘッダとロゴの間のスペースは確保する
2. 縦スクロールが発生しない

## 検証ステップ

- [x] review
- [x] browser-verification
