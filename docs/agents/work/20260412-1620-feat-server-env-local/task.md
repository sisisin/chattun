# Task: サーバー開発時にserver/.env.localが適切に評価されるようにする

## 達成条件

- server/package.jsonのdev/dev:mockスクリプトが--env-file-if-existsでserver/.env.localを読み込むこと
- 依存パッケージを追加しないこと
- vp checkが通る

## 背景

現在サーバー用環境変数（SLACK_APP_TOKEN, CLIENT_ID等）がルートの.env.localに置かれている。
Node.js 22の--env-file-if-existsフラグを使い、server/.env.localに配置できるようにする。
ルートの.env.localはmiseの_.fileで引き続き読まれるため、既存の動作は維持される。
