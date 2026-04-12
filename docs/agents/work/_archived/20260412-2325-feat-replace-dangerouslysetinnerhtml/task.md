# Task: 既存の表示パイプラインをmrkdwnパーサー+レンダラーに差し替え、dangerouslySetInnerHTMLを除去する

## Task定義（原文）

- Task: 既存の表示パイプラインをmrkdwnパーサー+レンダラーに差し替え、dangerouslySetInnerHTMLを除去する

## 達成条件

- Tweet.tsx の `dangerouslySetInnerHTML={{ __html: message.text }}` が除去されていること
- MrkdwnContent コンポーネントで Slack メッセージのテキストを描画していること
- 既存の表示機能（メンション表示、絵文字表示、リンク表示、コードブロック、画像添付）が維持されていること
- textToHtml パイプライン（TimelineQuery.ts）が不要になり除去されていること

## スコープ

- Tweet型の `text` フィールドをHTML文字列から生のSlack mrkdwnテキストに変更
- slackMessageToTweet での textToHtml 呼び出しを除去し、生テキスト + 添付ファイル情報を渡す形に変更
- Tweet.tsx で MrkdwnContent を使うように変更
- MrkdwnRenderer に不足している機能を追加:
  - ユーザーメンションの表示名解決（userId → displayName）
  - カスタム絵文字の画像表示（emoji storeから取得）
  - 自分自身のメンションのハイライト（mention-self）
  - 添付画像の表示
- textToHtml および関連するHTML生成関数の除去
- markdown-it 依存の除去（mrkdwnパーサーで代替）

## 検証ステップ

- [x] review
- [x] browser-verification
