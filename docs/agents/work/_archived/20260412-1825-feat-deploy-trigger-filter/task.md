# Task: デプロイが必要なときだけ動くようになってほしい

## 達成条件

1. GitHub ActionsのCI/CDワークフローが、デプロイに関係する変更（mise.toml, pnpm系, front/, server/）のときだけデプロイジョブを実行する
2. 完了通知にデプロイしたリビジョンのコミットメッセージとGitHub Actionsへのリンクが含まれる

## 背景

現在はmain pushのたびにデプロイが走るが、ドキュメントのみの変更などデプロイ不要な場合にも無駄にビルド・デプロイが実行されている。

## スコープ

- .github/workflows/push--build-and-deploy.yaml のpathsフィルタ追加
- 通知メッセージにコミットメッセージとactionリンクを追加
