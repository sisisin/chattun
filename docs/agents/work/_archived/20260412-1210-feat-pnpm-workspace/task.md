# Task: pnpm workspace化

## 達成条件

- ルートに `pnpm-workspace.yaml` を配置し、`front/` と `server/` を workspace として定義
- ルートに `package.json` を配置（private: true、workspace 管理用）
- `pnpm install` がルートから一括で実行できる
- 既存の lockfile が維持される（推移的依存のバージョンが変わらない）
- Docker ビルドが引き続き成功する
- CI ワークフローが引き続き成功する
- 型チェック・テストが通る

## 方針

段階移行アプローチ:
1. `shared-workspace-lockfile=false` で workspace 化（各パッケージの lockfile を維持）
2. shared lockfile への移行は別タスクで行う

## スコープ

- `pnpm-workspace.yaml` の作成
- ルート `package.json` の作成
- `.npmrc` に `shared-workspace-lockfile=false` 設定
- server の `@types/express` 追加（pnpm strict resolution で露出した既存の問題）
- ドキュメント更新
