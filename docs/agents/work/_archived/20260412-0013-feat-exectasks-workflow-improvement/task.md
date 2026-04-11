# Task: ExecTasksのワークフロー改善

## 達成条件

1. 作業ディレクトリ作成時にtask.mdを作成するステップがexectasks-guideに記述されている
2. ローカルレビュワーのプロンプトにtask.mdのパスが渡され、「このTaskが達成されているか？」の観点でレビューする構造になっている
3. TODO.md内のexectasks-guideが更新されている
4. start-local-reviewスキルが更新されている

## 背景

これまでローカルレビュワーにはTask contextとしてテキストでタスクの内容を渡していたが、task.mdファイルとして構造化することでレビュー観点を明確にする。

## スコープ

- docs/agents/exectasks/TODO.md のexectasks-guideセクション
- start-local-reviewスキル（.claude/plugins/marketplaces/ldsql/.claude/commands/start-local-review.md）
