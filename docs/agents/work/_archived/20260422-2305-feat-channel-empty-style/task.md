# Task: チャンネルページがemptyのときの表示がtimelineの表示と揃っていない

## Task定義（原文）

> チャンネルページがemptyのときの表示がtimelineの表示と揃っていない。アイコンが上にズレている
>   - Timelineと同じようなスタイルのアサインにするのがいいんじゃないすか

## 解釈

### 問題

ChannelView の empty 状態でロゴアイコンが上にズレて表示される。原因は TimelineView では `.menu-parent .tweetlist-empty` 親子セレクタで `height: calc(100vh - var(--spacing-2xl))` と `padding: 20vh 0 30vh` が適用されるが、ChannelView のラップ div に `menu-parent` クラスがないため empty のスタイルが正しく適用されていない。

### 達成条件

1. チャンネルページの empty 表示がタイムラインの empty 表示と同じ見た目になること

### スコープ

- `ChannelView.tsx` — ラップ div にクラスを追加
- `ChannelView.module.css` — empty スタイルに `.menu-parent` 相当を追加

## 検証ステップ

- [x] review
- [x] browser-verification
