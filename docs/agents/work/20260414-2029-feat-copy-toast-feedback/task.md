# Task: copyボタン押したときのフィードバックはボタンの文言変更じゃなくてtoastがいい

## 原文

- Task: copyボタン押したときのフィードバックはボタンの文言変更じゃなくてtoastがいい

## 修正方針

CopyButton コンポーネント（TweetView.tsx）で:
- `copied` state と useEffect（タイマー）を除去
- `ToastActions.showToast('Copied!')` でフィードバック
- ボタンは常に「C」表示のまま

## 達成条件

- コピーボタンクリック時にtoastで「Copied!」が表示される
- ボタンの文言が変化しなくなる
- lint / type-check が通る
