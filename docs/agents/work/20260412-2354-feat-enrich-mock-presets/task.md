# Task: モックサーバーのプリセットを充実させる

## Task定義（原文）

- Task: モックサーバーのプリセットを充実させる
  - とりあえず現状対応している仕様を確認できる範囲は入れておきたい

## 達成条件

- mrkdwnパーサーが対応している全構文（太字/斜体/取消線、コード、コードブロック、メンション、チャンネル参照、絵文字、リンク）をカバーするプリセットが存在すること
- `message-with-image` プリセットに `filetype` フィールドが追加され、画像表示が正常に動作すること
- 既存のプリセットが壊れないこと

## スコープ

- server/mock-server/presets.ts にプリセットを追加
- `message-with-image` プリセットの `filetype` 欠落を修正
- 新プリセット: formatted-message（太字/斜体/取消線/コード）、message-with-mentions（メンション各種）、message-with-links（URL/mailto）、message-with-emojis（絵文字）
