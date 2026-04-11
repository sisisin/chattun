# Learnings: ExecTasksワークフロー改善

## スキルファイルの所在

- プロジェクト内: `.claude/commands/`, `.claude/agents/` — gitで管理、プロジェクト固有
- ldsqlプラグイン: `~/.claude/plugins/marketplaces/ldsql/.claude/` — プラグインとして管理、別リポジトリ
- 同名ファイルが両方に存在する場合、プロジェクト内のものが優先される
