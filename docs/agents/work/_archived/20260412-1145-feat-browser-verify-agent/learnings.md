# Learnings: browser-verifier エージェント定義

## 設計

- エージェント定義は local-review にインラインで埋め込むのではなく、独立ファイルとして定義することで再利用性を確保
- devサーバー起動はエージェントの責務外とし、呼び出し元の責任と明記
- navigate ツールは tabs_create_mcp とは別に明示的に呼ぶ必要がある
