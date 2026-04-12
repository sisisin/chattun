# Task: CI整理

## 達成条件

- `run--notify-deploy-completed.yaml` の通知処理を `push--build-and-deploy.yaml` 内に統合する
- 統合後、`run--notify-deploy-completed.yaml` を削除する
- CIが正常に動作すること

## 背景

通知処理が `workflow_run` トリガーの別ワークフローに分離されている。`push--build-and-deploy` 内のdeployジョブの後に通知ジョブを追加し、ワークフローを簡素化する。

## スコープ

- `push--build-and-deploy.yaml` に通知ジョブを追加
- `run--notify-deploy-completed.yaml` を削除
- 通知ロジック（Discord Webhook経由）はそのまま維持
