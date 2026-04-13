# Task: resolveContextをTimeline時点で作って参照する構造にする

## 原文

- Task: resolveContextがTweetごとに生成されるの多分大分メモリに悪いので、Timeline時点で作って参照する構造が良さそう

## 解釈

現在 `TweetContent` が各ツイートごとに `resolveContext` オブジェクト（resolveUser/resolveEmoji/resolveChannel/myUserId）を `useMemo` で生成している。同じ `users/channels/emojis` データに基づくのに N個のオブジェクトが作られるのはメモリ効率が悪い。

TimelineView / ThreadView レベルで1回だけ resolveContext を生成し、React Context 経由で全 Tweet に配信する。

## 達成条件

- resolveContext がタイムライン / スレッド表示ごとに1つだけ生成される
- TweetContent は Context 経由で resolveContext を受け取り、自身では生成しない
- 表示動作が変わらない（メンション表示、絵文字解決、チャンネル名解決が正常）

## スコープ

- 共通の ResolveContext Provider を作成
- TimelineView, ThreadView でそれぞれ Provider を配置
- TweetContent の useMemo / useMappedState を削除し、Context から取得に変更

## 検証ステップ

- [x] review
- [x] browser-verification
