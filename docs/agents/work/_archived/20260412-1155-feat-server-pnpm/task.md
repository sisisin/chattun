# Task: serverのpnpm化

## 達成条件

- server/ ディレクトリのパッケージマネージャを yarn 1.x から pnpm に移行
- `pnpm install --frozen-lockfile` でインストールが成功する
- pnpm-lock.yaml が生成され、yarn.lock が削除されている
- 既存の npm scripts がすべて pnpm で実行可能
- Dockerfile のサーバービルドが pnpm を使用するように更新
- CI ワークフローが pnpm を使用するように更新
- `npx tsc --noEmit` が成功する（型チェック）
- dev サーバー (`pnpm dev`) が正常に起動する

## スコープ

- `server/package.json`: scripts や設定の調整
- `server/yarn.lock` → `server/pnpm-lock.yaml` への移行
- `Dockerfile`: server ビルドステップの pnpm 化
- `.github/workflows/`: CI でのサーバー関連ステップの pnpm 化
- `CLAUDE.md`, `README.md`: ドキュメント更新
- `mise.toml`: yarn の参照があれば削除

## 注意事項

- front は既に pnpm 化済み
- server は yarn 1.x を使用中
- resolutions があれば pnpm.overrides に変換が必要
