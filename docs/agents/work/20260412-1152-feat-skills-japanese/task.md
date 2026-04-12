# Task: skill類を日本語化する

## 達成条件

- .claude/ 配下のスキル・エージェント・コマンド定義の本文を日本語化
- ドキュメント出力は日本語にするよう指示を修正
- ただし thinking やサブエージェントへの指示は自由（日本語強制しない）
- 「Write ALL review output in Japanese」のような英語での日本語強制指示をなくし、自然に日本語で書かれた定義にする

## スコープ

- `.claude/agents/local-reviewer.md`: 本文を日本語化
- `.claude/commands/start-local-review.md`: 本文を日本語化
- `.claude/skills/do-task/SKILL.md`: 本文を日本語化
- `.claude/skills/skill-dev/SKILL.md`: 本文を日本語化
- `.claude/skills/shell-scripting/SKILL.md`: 本文を日本語化
- `.claude/skills/sandbox-denied-troubleshooting/SKILL.md`: 本文を日本語化
- 既に日本語のファイル（browser-verifier.md, vite-plus, mock-dev）はスキップ
