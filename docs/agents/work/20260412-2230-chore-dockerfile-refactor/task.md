# Task: Dockerfileのリファクタリング

## 達成条件

- pnpm storeのキャッシュマウント (`--mount=type=cache`) が両ステージに適用されていること
- base ステージで共通設定（corepack enable, PNPM_HOME/PATH設定）が共有されていること
- builder ステージが slim イメージを使用していること
- ビルドが正常に完了すること

## 背景

現在のDockerfileは従来のCOPY + RUN installパターンで、ビルド間でpnpm storeが共有されない。
また、corepack enable が2ステージで重複している。

## スコープ

- base ステージ共通化（PNPM_HOME/PATH設定、corepack enable）
- `--mount=type=cache,id=pnpm,target=/pnpm/store` を両ステージの pnpm install に追加
- builder/runner ともに slim イメージベースに変更
- bind mount による COPY 置換は複雑さに見合わないため不採用
