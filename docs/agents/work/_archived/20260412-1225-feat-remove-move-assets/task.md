# Task: move-assetsタスクを削除し、Dockerfileを修正

## 達成条件

- vite.config.ts から move-assets タスクを削除
- Dockerfile で build 出力を直接 COPY する（move-assets を経由しない）
- Docker ビルドが成功する

## 背景

move-assets は front のビルド出力を server/public に移動するタスク。
Docker マルチステージビルドで builder の build/ から直接 COPY すれば不要。
ローカル開発ではサーバーが SPA フォールバックで front の dev server を使うため、move-assets は Docker ビルド専用。
