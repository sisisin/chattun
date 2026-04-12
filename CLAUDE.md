# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## プロジェクト概要

chattun は Slack のタイムラインビューアーWebアプリ。Slack Socket Mode でリアルタイムイベントを受信し、Socket.IO 経由でブラウザに配信する。

## 開発コマンド

### 前提

- mise でツールバージョンを管理 (Node 22.18.0, Terraform 1.11.4)
- pnpm workspace（front / server）、ルートに単一 lockfile
- 環境変数は `.env.local` で設定（2箇所どちらでも可）
  - ルート `.env.local` — `mise.toml` の `_.file` で自動読み込み
  - `server/.env.local` — `pnpm dev` 時に `--env-file-if-exists` で読み込み
- 必須環境変数: `SLACK_APP_TOKEN`, `CLIENT_ID`, `CLIENT_SECRET`, `SERVER_BASE_URL`

### 起動

```sh
# 初回セットアップ (依存インストール + git hooks 設定)
pnpm install

# Redis
cd tools/docker && docker-compose up

# サーバー (port 3100, node --watch でホットリロード)
cd server && pnpm dev

# フロントエンド (port 3000, vite+)
cd front && pnpm start
```

### モックモード起動 (Slack不要)

Slack App のセットアップなしでFEの見た目を確認できるモード。

```sh
# モックサーバー (port 3100)
cd server && pnpm dev:mock

# フロントエンド (別ターミナル、VITE_MOCK_MODE で MockSlackClient に切り替え)
cd front && VITE_MOCK_MODE=true pnpm start
```

モックイベント送信:
```sh
# プリセットイベント (simple-message, message-with-image, reaction-added 等)
curl -X POST http://localhost:3100/api/mock/event/preset/simple-message

# 任意の Slack イベント JSON を送信
curl -X POST http://localhost:3100/api/mock/event/raw -H 'Content-Type: application/json' -d '{"type":"message","text":"hello","channel":"CMOCKCH001","user":"UMOCKUSER","ts":"'$(date +%s)'.000000"}'
```

### ビルド・リント・テスト

```sh
# ルートから一括実行
pnpm vp run -r ci          # front check+test + server check

# フロント (cd front で実行)
# vpビルトインコマンド
pnpm vp test run           # Vitest
pnpm vp lint               # Oxlint
pnpm vp lint --fix         # Oxlint autofix
pnpm vp check              # fmt + lint + type-check 一括実行

# vp run タスク (front/vite.config.ts で定義)
pnpm vp run build          # 本番ビルド
pnpm vp run test-all       # check + test 一括実行

# サーバー (cd server で実行)
pnpm vp check              # fmt + lint + type-check 一括実行
pnpm run ci                # vp check と同じ（CI用エイリアス）
```

### デプロイ

main push で GitHub Actions が Cloud Run へ自動デプロイ (`push--build-and-deploy.yaml`)。
手動: `tools/deploy/build_image.sh --tag=<tag>` → `tools/deploy/deploy.sh`

## アーキテクチャ

### サーバー (`server/src/`)

Express + Socket.IO + Slack Socket Mode の Node.js サーバー。

- `index.ts` — Express アプリ起動、ルーティング、セッション認証ミドルウェア、OAuth フロー (`/api/auth/slack`, `/api/slack/oauth_redirect`)、SPA フォールバック
- `slack.ts` — Slack Socket Mode クライアント。Slack イベント (message, reaction_added, reaction_removed) を受信し、認可済み Socket.IO クライアントへ配信
- `io.ts` — Socket.IO サーバー設定。Redis Adapter でスケーリング対応。接続時にセッション認証を検証
- `redis.ts` — ioredis インスタンスと Socket.IO Redis Adapter 生成
- `middleware.ts` — express-session (Redis Store, TTL 5日) と Helmet
- `config.ts` — 環境変数の読み込み
- `logging/` — Cloud Logging 互換の構造化 JSON ログ。AsyncLocalStorage ベースのコンテキスト伝播、Cloud Trace 連携

### フロントエンド (`front/src/`)

React 16 + [typeless](https://typeless.js.org/) (Redux ライクな状態管理) の SPA。vite+ でビルド。

**feature モジュールパターン**: 各機能は `features/<name>/` に以下のファイルで構成:
- `interface.ts` — Action 定義、State 型、Symbol
- `module.ts(x)` — Epic (副作用) + Reducer + Module フック
- `components/` — React コンポーネント
- `symbol.ts` — typeless の Symbol 定義

主要 feature:
- `session` — 認証状態管理、`/api/connection` で接続確認
- `slack` — Slack データ (メッセージ、ユーザー、チャンネル、絵文字、リアクション) のストア管理、リアルタイム更新
- `timeline` — タイムライン表示
- `thread` — スレッド表示
- `setting` — ユーザー設定 (チャンネルフィルタ、キーワードマッチ等)

**リアルタイム通信の流れ**:
Slack (Socket Mode) → `server/slack.ts` → Socket.IO → `front/services/rtm-socket.ts` → typeless dispatch → Reducer 更新 → React 再描画

### インフラ (`terraform/`)

GCP 上に構築: Cloud Run、Artifact Registry、Redis (Memorystore)、Workload Identity (GitHub Actions 用)
