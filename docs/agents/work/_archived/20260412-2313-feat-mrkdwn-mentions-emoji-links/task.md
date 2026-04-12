# Task: mrkdwnパーサーにメンション・絵文字・リンクの対応を追加する

## Task定義（原文）

- Task: mrkdwnパーサーにメンション・絵文字・リンクの対応を追加する
  - ユーザーメンション(`<@UID>`)、チャンネル参照(`<#CID|name>`)、グループメンション、特殊メンション
  - カスタム絵文字(`:emoji:`)、標準絵文字
  - Slackリンク(`<url|text>`)

## 達成条件

- mrkdwnパーサーが以下の構文をASTノードとしてパースできること:
  - ユーザーメンション: `<@UID>`
  - チャンネル参照: `<#CID|name>`
  - グループメンション: `<!subteam^GROUPID|@name>`
  - 特殊メンション: `<!here>`, `<!channel>`
  - カスタム絵文字: `:emoji_name:`
  - Slackリンク: `<url|text>`, `<url>`
- 各構文に対応するテストが充実していること（TDD）
- MrkdwnRendererがこれらのノードタイプをReactコンポーネントとして描画できること

## スコープ

- parser.tsへの新ノードタイプ追加とパースロジック実装
- parser.test.tsへのテスト追加
- MrkdwnRenderer.tsxへの新ノードタイプのレンダリング追加
- 既存パイプラインへの統合は行わない（後続タスク）

## 検証ステップ

- [x] review
- [x] browser-verification
