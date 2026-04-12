# Task: 投稿者の名前表示を表示名の値を利用する

## 背景

現在 `getMessageProfile` で `displayName` を決定する際、`member.profile.display_name || member.name` としている。
Slack の挙動では `display_name` が空の場合は `real_name`（本名）にフォールバックするため、`name`（ユーザー名）ではなく `real_name` をフォールバック先にするべき。

同様に `getProfile` 関数でも同じ修正が必要。

## 達成条件

1. `getMessageProfile` の displayName フォールバック先を `member.name` → `member.real_name` に変更
2. `getProfile` も同様に修正
3. vp check が通ること

## 検証ステップ

- [x] review
- [x] browser-verification
