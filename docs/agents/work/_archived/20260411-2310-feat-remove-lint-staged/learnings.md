# Learnings: feat/remove-lint-staged

## 学び

### lint-staged削除時のポイント
- huskyがlint-staged専用で使われている場合、huskyも一緒に削除する（他のhooksがないか確認）
- package.json内のhusky設定ブロックとdevDependencies両方から削除が必要
- lint-staged.config.jsとpackage.json内のlint-staged設定が両方存在する場合があるので両方チェック
