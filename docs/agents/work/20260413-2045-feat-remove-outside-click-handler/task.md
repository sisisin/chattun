# Task: OutsideClickを自前実装してreact-outside-click-handlerを消す

## 原文

- Task: OutsideClickが簡単に実装できるならreact-outside-click-handler消しちゃって。実装が複雑であれば残していいよ

## 解釈

`react-outside-click-handler` は EmojiMenuView で1箇所のみ使用。useRef + useEffect のパターンで簡単に置き換え可能。依存を削除して自前実装に置き換える。

## 達成条件

- `react-outside-click-handler` が package.json から削除されている
- 絵文字ピッカーの外側クリックで閉じる動作が維持されている
