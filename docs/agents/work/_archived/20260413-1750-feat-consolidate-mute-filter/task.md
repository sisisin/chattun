# Task: user muteとtimeline filterのロジックを集約

## 原文
user muteとtimeline filterのロジックが散ってるので集約して

## 分析
- **channelMatches フィルタ**: timeline/selector.ts の `getFilteredMessages` で適用 — 正しい位置
- **mutedUsers フィルタ**: TimelineView.tsx と ThreadView.tsx のコンポーネント内にインラインで重複 — selector に移すべき

## 修正計画
1. mutedUsers フィルタを timeline/selector.ts と thread/selector.ts に移動
2. TimelineView.tsx と ThreadView.tsx からフィルタロジックとmutedUsers取得を削除

## 達成条件
- mutedUsers フィルタが selector レベルで適用されている
- TimelineView/ThreadView にフィルタロジックが残っていない
- 動作が変わらない（ミュートユーザーのメッセージが非表示）

## 検証ステップ

- [x] review
- [x] browser-verification
