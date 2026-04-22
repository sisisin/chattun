# Task: attachmentが長い場合に畳んでshow moreしてほしい。あとattachmentに画像が付いてるときに表示されてなさそう

## 原文

- Task: attachmentが長い場合に畳んでshow moreしてほしい。あとattachmentに画像が付いてるときに表示されてなさそう
  - tmp/examples/message-long-attachment.json , tmp/examples/SCR-20260415-nmoi.png
  - tmp/examples/message-attachment-with-image.json

## 達成条件

1. **長いattachmentの折りたたみ**: TextAttachmentのテキストが一定の高さ（例: 200px程度）を超える場合、折りたたんで「Show more」ボタンを表示し、クリックで展開できるようにする
2. **attachment内の画像表示**: attachment内の`files`配列に画像がある場合（message unfurl等）、その画像をattachment内に表示する

## スコープ

### 1. 長いattachmentの折りたたみ
- AttachmentView コンポーネントにmax-height制限と折りたたみUI（Show more / Show less）を追加
- CSS + React state で実装

### 2. attachment内の画像表示
- サーバー側: attachment内のfilesを処理し、proceedされたデータに含める
- フロントエンド側: TextAttachment型にfiles情報を追加し、AttachmentViewで画像を描画
- 画像はサーバーの/api/fileプロキシ経由で表示する（既存のFileAttachmentと同じパターン）

## 参考

- `tmp/examples/message-long-attachment.json`: 長いattachmentの実例（GitHub PRのunfurl）
- `tmp/examples/SCR-20260415-nmoi.png`: Slackでの「Show more」UIのスクリーンショット
- `tmp/examples/message-attachment-with-image.json`: attachment内にfilesがある実例（メッセージunfurlに画像添付）

## 検証ステップ

- [x] review
- [x] browser-verification
