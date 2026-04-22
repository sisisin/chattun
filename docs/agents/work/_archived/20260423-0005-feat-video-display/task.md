# Task: 動画投稿の表示に対応する

## 原文

- Task: 動画投稿の表示に対応する
  - tmp/examples/message-video.json , https://knowledge-work.slack.com/files/U05V1TFDXAM/F0AU6GQH45Q/_____________2026-04-21_10.50.50.mov

## 達成条件

1. Slackの動画投稿（file_share subtype, filetype=mov/mp4等）がTweetContent内で再生可能な形で表示される
2. 既存の画像表示に影響しない

## スコープ

### 型定義の拡張
- `SlackEntity.d.ts`: files配列の要素に `mp4`, `thumb_video`, `media_display_type` フィールドを追加
- `timeline/interface.ts`: `FileAttachment` に動画用フィールドを追加

### セレクター修正
- `slack/selector.ts`: `getFileAttachments` で動画ファイル（`media_display_type === 'video'`）も抽出するよう拡張

### コンポーネント修正
- `TweetContent.tsx`: `FileAttachment` が動画の場合 `<video>` タグで表示し、画像の場合は従来通り `<img>` タグで表示

### モックプリセット
- `server/mock-server/presets.ts`: 動画付きメッセージのプリセット追加

## 参考

- `tmp/examples/message-video.json`: 動画ファイルの実データ構造
  - `mp4` フィールド: mp4ストリーミングURL
  - `thumb_video`: サムネイルURL
  - `media_display_type: "video"`: 動画判定フラグ

## 検証ステップ

- [x] review
- [x] browser-verification
