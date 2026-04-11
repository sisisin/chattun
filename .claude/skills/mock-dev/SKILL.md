---
name: mock-dev
description: 'モックサーバーを使ったFE開発環境を起動し、モックイベントを送信してUIを確認する。Slack App不要。'
argument-hint: '[preset-name or "start" or "event <json>"]'
---

# Mock Dev - モックサーバー開発モード

モックサーバーとFEをモックモードで起動し、Slack Appなしでメッセージの見た目を確認する。

## 使い方

### `/mock-dev start` — 環境起動

1. モックサーバー (`server/mock-server/`) をport 3100で起動
2. FEを `REACT_APP_MOCK_MODE=true` で起動

```
cd server && yarn dev:mock    # ターミナル1
cd front && BROWSER=none REACT_APP_MOCK_MODE=true yarn start  # ターミナル2
```

起動後、`https://local.sisisin.house:3000/` でアクセス可能。

### `/mock-dev <preset-name>` — プリセットイベント送信

利用可能なプリセット:
- `simple-message` — 通常のテキストメッセージ
- `message-with-image` — 画像付きメッセージ
- `reaction-added` — リアクション追加
- `reaction-removed` — リアクション削除
- `message-changed` — メッセージ編集
- `message-deleted` — メッセージ削除
- `threaded-reply` — スレッド返信

### `/mock-dev event <json>` — 任意イベント送信

Slack イベント JSON をそのまま送信する。

## 手順

引数に応じて以下を実行する:

- `$ARGUMENTS` が `start` の場合:
  1. port 3100 と 3000 が使用中でないか確認し、使用中なら既存プロセスを報告
  2. モックサーバーをバックグラウンドで起動 (`cd server && yarn dev:mock`)
  3. FEをバックグラウンドで起動 (`cd front && BROWSER=none REACT_APP_MOCK_MODE=true yarn start`)
  4. 両方のコンパイル完了を確認
  5. 起動完了したら `https://local.sisisin.house:3000/` のURLをユーザーに案内する

- `$ARGUMENTS` がプリセット名の場合:
  1. 以下のコマンドを実行してイベントを送信:
     ```sh
     curl -X POST "http://localhost:3100/api/mock/event/preset/$ARGUMENTS"
     ```
  2. 送信結果をユーザーに報告する

- `$ARGUMENTS` が `event` で始まる場合:
  1. `$ARGUMENTS` から先頭の `event ` プレフィックスを除去してJSONボディを取得
  2. 以下の要領で raw エンドポイントに送信:
     ```sh
     JSON_BODY="${ARGUMENTS#event }"
     curl -X POST http://localhost:3100/api/mock/event/raw \
       -H 'Content-Type: application/json' \
       -d "$JSON_BODY"
     ```
  3. 送信結果をユーザーに報告する

- `$ARGUMENTS` が空または `list` の場合:
  1. `curl http://localhost:3100/api/mock/presets` でプリセット一覧を表示

## モックデータ

- チャンネル: `CMOCKCH001` (#mock-general), `CMOCKCH002` (#mock-random)
- ユーザー: `UMOCKUSER` (mockuser)
- チーム: `TMOCKTEAM` (mock-workspace)
- アセット: `/api/mock/assets/avatar.png`, `/api/mock/assets/sample.png`
