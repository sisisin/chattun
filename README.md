# chattun

[![CircleCI](https://circleci.com/gh/opt-tech/chattun.svg?style=svg&circle-token=8a09945e171444e71d3a1a3c9f2f83d4d7a8778d)](https://circleci.com/gh/opt-tech/chattun)
[![Netlify Status](https://api.netlify.com/api/v1/badges/614731c1-557d-4451-95cf-fd2ea7af5e78/deploy-status)](https://app.netlify.com/sites/chattun/deploys)

## 開発環境

### Slack App の設定

`本番環境設定` の項目を参照のこと
本番と同じアプリを使いまわしても特に不都合はない

### 必須の環境変数設定

- SLACK_APP_TOKEN: `本番環境設定` の `サーバー側` を参照のこと
- CLIENT_ID: 同上
- CLIENT_SECRET: 同上
- SERVER_BASE_URL: 同上。デフォルトなら `http://localhost:3100` 使っておけばいい

\* REDIS_URL は未設定でも動く

### OAuth フローを動かせるようにする設定

Slack App の Redirect URL が https しか受け付けないためにローカルマシン上で https のリクエストを受けられるようにする必要がある  
そのため、[create-react-app の HTTPS 利用の機能](https://create-react-app.dev/docs/using-https-in-development/)を使う

これによって、前段に https のプロキシサーバーを立て、フロントエンドとサーバーへのリクエストを全てプロキシで受けて処理するような形にする

#### 自己署名証明書を使う方法

cra が提供してくれるやつをそのまま使うだけの方法

- Slack App 設定
  - `OAuth & Permissions` > `Redirect URLs` に以下の値を追加
  - `https://localhost:3000/api/slack/oauth_redirect`

#### 正式な証明書を使う方法

[この辺](https://blog.jxck.io/entries/2020-06-29/https-for-localhost.html)が参考になる  
有効な証明書を使うと余計な警告が出ないのでおすすめ

- 証明書を用意して cert,key ファイルを用意する
  - 有効な証明書を用意したい場合にのみ必要
- Slack App 設定
  - SSL 証明書を発行した URL を元に Redirect URLs に値を追加
  - `[署名されたURL]/api/slack/oauth_redirect`
- 環境変数設定
  - サーバー
    - SERVER_BASE_URL: `[署名されたURL]:3000` を設定
  - フロント
    - HOST: 署名したドメイン
    - SSL_CRT_FILE: cert ファイル
    - SSL_KEY_FILE: key ファイル

### 開発用コマンド

- `docker/` で `docker-compose up`
- `server/` で `yarn dev`
- `front/` で
  - `yarn install`
  - `yarn start`

# How to build Docker image

```sh
$ cd .circleci
$ ./build_image
```

# 本番環境設定

## Slack App 設定

- SlackApp を作成する
- `Slack App` > `Basic Information` 内の `App Level Token` を設定する。 `authorizations:read` , `connections:write` の権限が必要。token は後ほど環境変数として設定するので控えておく
- `Event Subscriptions`
  - > `Enable Events` を ON にする
  - `Subscribe to events on behalf of users` で以下の項目を追加する
    - `message.channels` , `reaction:added` , `reaction:removed`
- `Socket Mode` > `Enable Socket Mode` を ON にする
- `OAuth & Permissions` > `Redirect URLs` にサーバーの URL を以下のように設定する
  - `https://[サーバーのドメイン]/api/slack/oauth_redirect`
- 最後に Slack App のワークスペースへのインストールを実施

## 環境変数設定

### サーバー側

- SLACK_APP_TOKEN: 前項で控えた `App Level Token` を設定する
- CLIENT_ID: `Slack App` > `App Credentials` 内の Client ID
- CLIENT_SECRET: 同 Client Secret
- SERVER_BASE_URL: サーバーの URL。OAuth フローでのリダイレクト先設定などに利用
- REDIS_URL: セッション情報保存用の redis の connection string
  - heroku なら redis を設定した時点で自動で設定される

### フロント側

- REACT_APP_BASE_URL: ホストされる URL。heroku を利用する場合、ビルドも heroku で行うため heroku 上でサーバーの環境変数として設定してやる必要があるので注意

## デプロイ設定

heroku なら `git push heroku master` でデプロイする設定してあれば push するだけで OK のはず
