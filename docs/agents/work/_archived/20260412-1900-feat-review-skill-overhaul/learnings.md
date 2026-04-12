# Learnings

- Claude CodeのAgent toolで利用可能な`subagent_type`は固定リスト（general-purpose, local-reviewer等）。`.claude/agents/`にカスタムエージェント定義を置いてもsubagent_typeとしては認識されない。カスタムエージェントの手順を使いたい場合はgeneral-purposeエージェントに.mdファイルを読ませる形にする。
- commandsディレクトリのファイル名がそのままスキル名になる（`verify.md` → `/verify`）。
