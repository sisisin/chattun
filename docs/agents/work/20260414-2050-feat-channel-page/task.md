# Task: チャンネルページを作り、指定されているチャンネルの投稿のみを表示する

## Task定義（原文）

> チャンネルページを作り、指定されているチャンネルの投稿のみを表示する
>   - Tweetのchannelへのリンクはslack appからこのチャンネルページにする

## 解釈

### 達成条件

1. `/channel/$channelId` ルートを追加し、指定チャンネルの投稿のみを表示するページを作る
2. TweetView の channelName リンクを Slack app へのリンクからこのチャンネルページへのリンクに変更する
3. チャンネルページは既存の TimelineView/ThreadView と同様のレイアウト（Menu + メッセージリスト）を持つ

### スコープ

- `router.tsx` — `/channel/$channelId` ルート追加
- `features/channel/` — 新しい feature モジュール（interface.ts, symbol.ts, module.tsx, selector.ts, components/ChannelView.tsx）
- `features/slack/selector.ts` — `getChannelLink` を Slack リンクからチャンネルページリンクに変更
- `features/timeline/interface.ts` — `channelLink` 型を内部リンク対応に変更
- `TweetView.tsx` — channelName 表示部分を `AppLink` に変更
