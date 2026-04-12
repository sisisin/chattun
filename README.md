# chattun

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
そのため、Vite の HTTPS 設定を使う

これによって、前段に https のプロキシサーバーを立て、フロントエンドとサーバーへのリクエストを全てプロキシで受けて処理するような形にする

#### HTTPS セットアップ

`tools/setup/setup_pem.sh` を実行すると `tmp/` に証明書が配置され、Vite dev server が自動で HTTPS を有効にする。

```sh
tools/setup/setup_pem.sh
```

**正式な証明書を使う場合（ブラウザ警告なし）:**

`.env.local` に `CERT_DIR` を設定してからスクリプトを実行する。

```
CERT_DIR=/etc/letsencrypt/live/local.sisisin.house
```

- 証明書の発行手順は別途管理
- `front/.env.local` に `HOST=local.sisisin.house` を設定
- Slack App の Redirect URLs: `https://local.sisisin.house:3000/api/slack/oauth_redirect`
- SERVER_BASE_URL: `https://local.sisisin.house:3000`

**CERT_DIR 未設定の場合:**

自己署名証明書を自動生成する。ブラウザで警告が出るが開発には支障なし。

- Slack App の Redirect URLs: `https://localhost:3000/api/slack/oauth_redirect`
- SERVER_BASE_URL: `https://localhost:3000`

### 開発用コマンド

- `tools/docker/` で `docker-compose up`
- `server/` で `pnpm dev`
- `front/` で
  - `pnpm install`
  - `pnpm start`

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

## デプロイ

main push で GitHub Actions が Cloud Run へ自動デプロイ。
手動: `tools/deploy/build_image.sh --tag=<tag>` → `tools/deploy/deploy.sh`
