# Task: パフォーマンスチューニングしたほうがよさそうなところを探し、Task化する

## 原文

- Task: パフォーマンスチューニングしたほうがよさそうなところを探し、Task化する

## 達成条件

- フロントエンドのコードベースを調査し、パフォーマンス改善が見込める箇所を特定する
- 特定した箇所をTODO.mdにTask化して追記する

## 調査結果

### 1. MrkdwnContent / BlockKitContent のレンダリングにメモ化がない

- `front/src/app/features/mrkdwn/MrkdwnRenderer.tsx` — `parseMrkdwn(text)` が毎レンダリングで呼ばれる
- `front/src/app/features/mrkdwn/BlockKitRenderer.tsx` — blocks の map/filter が毎レンダリングで実行

### 2. TweetView に React.memo がない

- `front/src/app/features/timeline/components/tweet/components/TweetView.tsx` — TimelineView/ThreadView からの再レンダリングで全 Tweet が再描画

### 3. useMappedState がインラインオブジェクトを返す箇所が複数

- `TweetView.tsx` — `{ developerMode }` を毎回新しいオブジェクトで返す
- `EmojiMenuView.tsx` — `{ martEmojis, clientY, isEmojiMenuVisible, targetMessage }` を毎回新しいオブジェクトで返す

### 4. getMartEmojis セレクタが毎回新しい配列を生成

- `front/src/app/features/slack/selector.ts` — `getMartEmojis` が呼び出し毎に `[{ id: 'custom', ... }]` を生成

### 5. ResolveContext の再計算が広すぎる

- `front/src/app/features/mrkdwn/ResolveContext.tsx` — users/channels/emojis オブジェクト全体に依存しており、関係ない slack state の変更でも再計算される

### 6. タイムラインに仮想スクロールがない

- `front/src/app/features/timeline/components/TimelineView.tsx` — 全メッセージを DOM に展開

### 7. リアクション削除時の配列操作

- `front/src/app/features/slack/module.ts` — OnReactionRemoved で reduce + spread により毎回新しい配列を生成

## Task化の方針

影響度と実装コストのバランスで優先順位をつける。仮想スクロールは大規模な変更になるためBacklogに回す。
