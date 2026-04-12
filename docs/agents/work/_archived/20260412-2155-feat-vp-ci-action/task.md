# Task: CIでvite-plusの公式アクションを利用するように修正する

## 達成条件

- `pull--check.yaml` で `voidzero-dev/setup-vp` を利用していること
- `setup-node`、`corepack enable pnpm`、手動のnode version取得ステップが `setup-vp` に置き換わっていること
- `pnpm install` が `vp install` に置き換わっていること
- CIが正常に動作すること（既存のcheck/test/buildが通ること）

## 背景

vite-plus公式のGitHub Action `voidzero-dev/setup-vp` を使うと、Node.js/パッケージマネージャーのセットアップとキャッシュを一括で行える。
現在は `actions/setup-node` + `corepack enable pnpm` + 手動キャッシュ設定で冗長。

## スコープ

- `pull--check.yaml` の Node.js セットアップを `setup-vp` に置換
- `push--build-and-deploy.yaml` は Node.js を直接使わない（terraform + docker build）ため対象外

## 検証ステップ

- [x] review
