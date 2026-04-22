# Task: TweetContentに画像があるときに横並びになることがあるのを修正

## 原文

- Task: TweetContentに画像があるときに横並びになることがあるのを修正。ちゃんと縦に並ぶようにする
  - tmp/examples/message-horizontal-image.json
  - なんか過去にTaskにした気がするので、過去の作業ログを検めたうえで対応方針を検討してもらうのが良さそうな気がする

## 過去の関連タスク

- `20260413-0145-feat-fix-tweet-layout`: `.tweet-contents` を `inline-block` → `block` に変更して横並び問題を修正した。しかし現在の問題は `<a>` タグがインライン要素のままであるために、テキスト直後の画像が横に並ぶケース。

## 達成条件

1. TweetContent内の画像（`<a><img></a>`）が常に縦に並ぶこと
2. テキストと画像の間も改行されること

## スコープ

- `.tweet-contents-image` CSSクラスに `display: block` を追加して画像を常にブロック要素にする
- BlockKitContentのrenderでspan要素で出力されるリッチテキストが画像と横並びにならないようにする

## 参考

- `tmp/examples/message-horizontal-image.json`: テキスト「割と高め」+ 横長スクリーンショット1枚。`<span>割と高め</span>` の直後に `<a><img></a>` がインラインで横並びになる
