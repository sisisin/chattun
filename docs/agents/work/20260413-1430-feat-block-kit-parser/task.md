# Task: block kitのパース・レンダリング

## 原文

- Task: block kitのパース・レンダリング

## 解釈・スコープ

### 背景

現在、Slackメッセージは `message.text`（mrkdwn形式のフォールバックテキスト）を独自パーサーでパースして表示している。
Slack APIは `blocks` 配列でBlock Kit形式の構造化データも送信しているが、これは現在無視されている。

Block Kit（特に `rich_text` ブロック）は以下の利点がある：
- リスト（箇条書き・番号付き）が明示的に表現される
- 引用ブロックが明示的
- インラインスタイル（太字、斜体等）が要素の `style` プロパティとして構造化されている
- mrkdwnのパース曖昧性が解消される

### 達成条件

1. `SlackEntity.Message.Basic` に `blocks` フィールドを追加
2. Block Kit の型定義を作成（`rich_text`, `rich_text_section`, `rich_text_list`, `rich_text_preformatted`, `rich_text_quote` とそのelement型）
3. Block Kit レンダラーコンポーネントを作成
4. `Tweet` インターフェースに blocks を追加し、selector でパススルー
5. `TweetContent` で blocks が存在する場合は blocks レンダリングを優先、なければ従来の mrkdwn パースにフォールバック
6. モックプリセットに Block Kit を活用したリッチなメッセージを追加してテスト可能にする

### スコープ

- 対象のBlock Kitブロックタイプ: `rich_text` のみ（他のブロックタイプは将来対応）
- `rich_text` 内の要素: `rich_text_section`, `rich_text_list`, `rich_text_preformatted`, `rich_text_quote`
- 各要素内のインライン要素: `text`, `user`, `channel`, `emoji`, `link`, `usergroup`, `broadcast`
- ファイル添付、画像添付は従来のロジックをそのまま維持
