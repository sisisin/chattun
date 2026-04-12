# Task: 画像付き投稿のdeep linkが動かないので修正する

## 原文
画像付き投稿のdeep linkが動かないので修正する
- tmp/examples/message-with-image.json にdeeplinkに失敗するmessageのjsonを置いたので参考にすること

## 分析
- サンプルJSONの `file_share` サブタイプのメッセージでは `msg.team` フィールドが存在しない
- `getSlackLink` の `directly` ケースで `msg.team` が `undefined` のとき、`team=undefined` という文字列がURLに含まれてしまう
- `files[0].user_team` にteam IDが含まれているため、`msg.team ?? msg.files?.[0]?.user_team` でフォールバック
- `getChannelLink` の `directly` ケースにも同様のフォールバックを適用

## 達成条件
- `team` が `undefined` のメッセージでも `files[0].user_team` からteam IDを取得してdeep linkが動作する
- team情報がどこにもない場合は `link: undefined` を返す

## スコープ
- `front/src/app/types/slack/SlackEntity.d.ts` — files型に `user_team` 追加
- `front/src/app/features/slack/SlackQuery.ts` — `getTeamId` ヘルパー追加、`getSlackLink`/`getChannelLink` で利用
