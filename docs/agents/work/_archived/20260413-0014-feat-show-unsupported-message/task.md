# Task: 未対応メッセージ形式のフォールバック表示

## 原文
Tweetが「テキスト・ファイル・添付画像すべて空なら非表示」となっているが、表示はして。本文がパースできなかった場合にTweetBodyは対応してないメッセージ形式なんでslack appを見てくれ、とでも出しておいて

## 達成条件
- テキスト・ファイル・画像すべて空のメッセージが非表示にならず、フォールバックメッセージが表示される
- フォールバックメッセージは「対応していないメッセージ形式です。Slack appで確認してください」のような内容

## スコープ
- `front/src/app/features/tweetList/components/tweet/Tweet.tsx` の空チェック(67-69行目)をフォールバック表示に変更
- `front/src/app/features/tweetList/components/tweet/Tweet.css` にフォールバック用スタイル追加

## 検証ステップ

- [x] review
- [x] browser-verification
