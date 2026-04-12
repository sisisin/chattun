## Browser Verification

STATUS: BLOCKED

### 確認内容

- devサーバー (port 3000): 起動済み（Vite dev server）
- モックサーバー (port 3100): **モックサーバーではなく本番サーバー（server/src/index.ts）が起動している**
  - `/api/connection` → 401 Unauthorized（セッション認証失敗）
  - `/api/mock/bootstrap` → 404 Not Found（モックエンドポイントが存在しない）
  - `/api/mock/presets` → 404 Not Found（モックエンドポイントが存在しない）
- ブラウザで `https://local.sisisin.house:3000` にアクセスすると `/login` にリダイレクトされる
- コンソールエラー: なし

### ブロック理由

port 3100 で起動しているのはモックサーバー（`server/mock-server/index.ts`）ではなく、本番サーバー（`server/src/index.ts`）です。本番サーバーは OAuth 認証が必要なため `/api/connection` が 401 を返し、ログイン画面から先に進めません。

設定画面のトースト通知を検証するには、以下のいずれかが必要です:

1. port 3100 のプロセスを停止し、`cd server && pnpm dev:mock` でモックサーバーを起動し直す
2. または `cd server && pnpm dev` の代わりに本番サーバーで Slack OAuth ログインを完了する
