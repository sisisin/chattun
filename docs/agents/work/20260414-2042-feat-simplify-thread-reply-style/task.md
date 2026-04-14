# Task: スレッド強調の簡素化とスレッドボタン削除

## Task定義（原文）

> スレッド強調、背景色は変えなくていい。あとスレッドボタンなくして良いかな

## 解釈

### 達成条件

1. スレッドリプライの背景色変更（`.tweet-thread-reply` の `background: var(--background-sub)`）を削除する
   - 左ボーダー（`border-left: 3px solid var(--border-main)`）は残す
2. Tweet のアクションバーからスレッドボタン（`IconThread` のリンク）を削除する
3. 「スレッドを表示」リンクは残す（これはスレッドボタンとは別）

### スコープ

- `TweetView.tsx` — スレッドボタン（`IconThread` 付きの `AppLink`）を削除
- `Tweet.module.css` — `.tweet-thread-reply` から `background` を削除、スレッドボタン関連の未使用CSSを削除
- `Icons.tsx` — `IconThread` が他で使われていなければ削除
