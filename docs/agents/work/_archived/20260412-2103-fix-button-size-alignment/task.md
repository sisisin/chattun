# Task: 追加ボタンと保存ボタンの大きさが揃ってないのを直す

## 達成条件

- `.button-add` と `.button-primary` が `.setting-group-footer` 内で同じ高さで表示される
- フォントサイズとpaddingが統一されている

## 背景

設定画面の各セクション（チャンネルマッチ、ミュート）で「+ 追加」ボタンと「保存」ボタンが横並びになっているが、`.button-add` の `font-size` が `--font-small` (0.8rem) で、`.button-primary` は未指定（1rem継承）のため高さが揃っていない。

## スコープ

- `front/src/app/css/_form.css` の `.button-add` のフォントサイズを修正

## 検証ステップ

- [x] review
- [x] browser-verification
