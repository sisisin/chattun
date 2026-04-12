# Task: tone違い絵文字の表示対応 (GitHub issue #32)

## 達成条件

- skin-tone付きリアクション（例: `+1::skin-tone-3`）が正しく表示される
- `em-emoji` web componentに適切な `skin` 属性が渡される

## 背景

Slackのリアクションでskin-tone付き絵文字（例: 👍🏼）を使うと、reaction nameが `+1::skin-tone-3` のような形式で送られる。現在のコードではこのcompound nameをそのまま `em-emoji id` に渡しているため、正しくレンダリングされない。

## スコープ

- reaction name から base emoji と skin-tone を分離するヘルパー関数を追加
- `Tweet.tsx` の `em-emoji` に `skin` 属性を渡す
- `react-app-env.d.ts` に `skin` 属性の型定義を追加

## 検証ステップ

- [x] review
- [x] browser-verification
