# Task: dev modeのCボタンの文字位置ズレ修正・コピーフィードバック

## 原文

- Task: dev modeの `C` ボタンの文字位置がボタンの下部にズレているのを修正。あとコピーしたら「コピーしました」を表示するようにする

## 分析

### 文字位置ズレ
- Cボタンのテキストに `.tweetActionsReactionIcon` クラスを使用 → SVGアイコン用の `width: 16px; height: 16px; stroke` が不適切
- 修正: テキスト用の専用クラス `.tweetActionsCopyText` を新設

### コピーフィードバック
- `copyClicked` はクリップボードにコピーするだけでUIフィードバックなし
- 修正: CopyButton コンポーネントを切り出し、コピー後1.5秒間「Copied!」表示

## 達成条件

- Cボタンの文字がボタン中央に配置される
- コピー後に「Copied!」が一定時間表示される

## 検証ステップ

- [x] review
- [x] browser-verification
