# Task: alertなどのブロッキングする機能の利用をやめたい。そのためのアラート用コンポーネントを用意して載せ替える

## 達成条件

- `alert()` の呼び出しがフロントエンドコードから全て除去されている
- 代わりに既存の Toast コンポーネントでユーザーに通知する
- ユーザー体験が損なわれない（メッセージを見てからリダイレクトされる）

## 背景

`alert()` はブラウザのブロッキングダイアログでUXが悪い。既存の Toast コンポーネント（2秒間表示）で代替できる。

## スコープ

- `front/src/app/services/rtm-socket.ts` の alert を Toast に置換
- `front/src/app/features/session/module.ts` の alert を Toast に置換

## 検証ステップ

- [x] review
