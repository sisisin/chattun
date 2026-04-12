# Task: Tweetのチャンネル名表示をslackへのdeep linkとして、クリックしたら開けるようにする

## 達成条件

- タイムライン上のツイートに表示されるチャンネル名（`#channel-name`）がクリック可能なリンクになっている
- リンク先は設定画面の deepLinking 設定（viaBrowser / directly）に従う
  - viaBrowser: `https://{domain}.slack.com/archives/{channelId}` を新しいタブで開く
  - directly: `slack://channel?team={team}&id={channelId}` でSlackアプリを直接開く

## 背景

チャンネル名はテキストとして表示されているだけで、Slackのチャンネルに遷移する手段がない。既存のdeep linking設定を活用して、ユーザーの好みに合わせたリンクにする。

## スコープ

- `Tweet` interface に `channelLink` を追加
- `SlackQuery.ts` でチャンネルリンクを生成
- `Tweet.tsx` でチャンネル名を `<a>` タグでラップ

## 検証ステップ

- [x] review
- [x] browser-verification
