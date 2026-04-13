# Task: tweet feature の module 構造を blueprint パターンに合わせる

## 原文
useTweetModuleをTimelineViewで実行してるのは誤り。.blueprintで出力するfeatureの構造を確認して、適切な構造に整理して。module.tsxがTweetというComponentを定義してその中で利用するのが正しい。そして今のTweet ComponentはTweetViewという名前にするのが適切でしょう
- featureの構造をskillに落とすのもやっておいて

## 分析
.blueprints/feature パターン:
- `module.tsx`: `handle()` を呼び、`<XxxView />` をレンダリングする Module コンポーネントをexport
- `components/XxxView.tsx`: 実際のビューコンポーネント
- `interface.ts`, `symbol.ts`: typeless 定義

現状の tweet module:
- `module.tsx`: epic + `useTweetModule()` フック（handle() を呼ぶだけ）
- `components/Tweet.tsx`: TweetItem コンポーネント
- TimelineView/ThreadView で `useTweetModule()` を呼んでいる

## 修正計画
1. `components/Tweet.tsx` → `components/TweetView.tsx` にリネーム、export名も `TweetView` に
2. `module.tsx` を blueprint パターンに合わせ、`Tweet` コンポーネントをexport（handle() + <TweetView />）
3. TimelineView/ThreadView から `useTweetModule()` を削除、`Tweet` を module.tsx から import
4. feature 構造を skill に記載

## 達成条件
- module.tsx が blueprint パターンに沿っている
- TweetView が View コンポーネント
- useTweetModule が廃止されている
- feature 構造がスキルとして文書化されている

## 検証ステップ

- [x] review
- [x] browser-verification
