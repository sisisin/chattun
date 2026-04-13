# Task: リアクションのoptimistic UI

## 原文

- Task: リアクションしたときにサーバーからのイベントを待たずにUIに反映させちゃいたい。十全に情報が揃っていなければ無理にやらなくてもいいかも

## 分析

### 現状
- リアクション追加/削除はAPIコール後、サーバーからのSocket.IOイベントでUI更新
- 通信遅延分だけUIの反映が遅れる

### 修正内容
1. **Optimistic update**: APIコール前に `SlackActions.onReactionAdded` / `onReactionRemoved` を dispatch してローカル state を即時更新
2. **二重更新防止**: 既にuserが含まれている場合のadd、userが含まれていない場合のremoveをスキップするガードを reducer に追加

### 情報の十全性
- userId: `getSlackState().profile.userId` で取得可能
- reaction名、channelId、ts: アクション引数から取得可能
- 全情報が揃っているため実装可能

## 達成条件

- リアクションがクリック即座にUIに反映される
- サーバーイベント到着時に二重カウントされない

## 検証ステップ

- [ ] review
- [ ] browser-verification
