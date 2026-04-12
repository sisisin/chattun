# Task: pinactをmiseで入れて、pre commitで実行されるようにする

## 達成条件

- mise.tomlにpinactが追加されていること
- pre-commitフックでpinactが実行されるようになっていること
- 既存のGitHub Actionsワークフローにpinactが適用済みであること

## 背景

pinact は GitHub Actions のバージョンをコミットSHAにピン留めするCLIツール。
セキュリティベストプラクティスとして、タグ指定よりSHAピン留めが推奨されている。

## スコープ

- mise.toml に pinact を追加
- pre-commit フックに pinact run を追加
- 既存ワークフローに pinact run を適用

## 検証ステップ

- [x] review
