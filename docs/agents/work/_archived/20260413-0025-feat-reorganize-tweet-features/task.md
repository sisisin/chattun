# Task: Timeline/TweetList/Tweet/SlackQuery/mrkdwn の整理

## 原文
Timeline,TweetList,Tweet,slack/SlackQuery,mrkdwnらへんがちょっとロジックが散逸してて見通しが悪いので整理して
- 特にTweetListはtypeless moduleの実装がすっからかんなので、timelineかtweetに寄せて良いと思う。コピーボタンはTweetのものだからtweetが適当そうか
- TweetのContent部分をTweetContentとかにして、そのなかにmrkdwnとかを押し込めたほうがよさそう
- SlackQueryに実装されてる関数が、selectorだったりTweet系コンポーネント向けの関数だったりでばらつきがありそう。selectorはselector.tsって名前にして置いてあるほうが良さそう（他の*Query.ts系全般に言える）
- featuresはネストしていいので、例えばtimeline/tweet/とかも有り

## 現状分析
- **tweetList**: ほぼ空のtypeless module。interface.tsに`TweetActions`（copyClicked, tweetIntersected）、module.tsxに最小のreducer。コンポーネントはTweet.tsx, TweetList.tsxなど
- **timeline**: Tweet型定義がinterface.tsにある。TimelineQuery.tsがslackMessageToTweetの変換ロジック
- **slack/SlackQuery.ts**: slackMessageToTweet()がここにあるが、selectorとTweet変換が混在
- **mrkdwn**: 独立したparser+renderer。Tweet.tsxから利用

## リファクタリング計画

### 1. tweetListをtweetにリネームし、timeline/tweet/に移動
- `features/tweetList/` → `features/timeline/tweet/` としてネスト
- tweetListのtypeless module（TweetActions等）をtimeline配下に統合
- TweetListSymbolを削除し、timeline moduleに統合

### 2. TweetContentコンポーネントを抽出
- Tweet.tsxのコンテンツ部分（MrkdwnContent、ファイル表示、画像表示、フォールバック表示）を`TweetContent.tsx`に分離

### 3. SlackQuery.tsをselector.tsにリネーム
- `slack/SlackQuery.ts` → `slack/selector.ts`
- `timeline/TimelineQuery.ts` → `timeline/selector.ts`
- `thread/ThreadQuery.ts` → `thread/selector.ts`

### 4. Tweet型をtimeline/tweet/に移動
- `timeline/interface.ts`のTweet関連型（Tweet, Reaction, FileAttachment等）を`timeline/tweet/types.ts`に移動

## 達成条件
- tweetList featureが独立featureではなくtimeline/tweet/に移動している
- TweetContentコンポーネントが分離されている
- *Query.tsがselector.tsにリネームされている
- ビルド・テスト・lintが通る

## 検証ステップ

- [x] review
- [x] browser-verification
