# Task: serverのnpm scriptsをvp task化 + repo root運用

## 達成条件

- 各パッケージに `ci` npm script を定義（front: `vp run test-all`, server: `tsc --noEmit`）
- ルートで `vp run -r ci` を実行して全ワークスペースの CI を一括実行できる
- git hooks をルートに移動（front/.vite-hooks/ → .vite-hooks/）
  - pre-commit: `vp staged`（ルートの vite.config.ts の staged 設定を参照）
  - pre-push: `vp run -r ci`
- ルートの vite.config.ts に staged 設定のみ定義
- front/vite.config.ts から staged 設定を削除
- ルートの package.json に `prepare: "vp config"` を設定
- Docker ビルド、CI が引き続き成功する
- CLAUDE.md 更新

## スコープ

- git hooks の workspace 対応（front 特化 → ルート統合）
- 各パッケージの ci script 定義
- ルート vite.config.ts（staged のみ）
- Dockerfile、CLAUDE.md 更新
