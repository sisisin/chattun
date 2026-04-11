# Learnings: feat/viteplus-skill

## 学び

### Vite+ について
- Vite+ は VoidZero の統合ツールチェイン。`vp` CLI で dev/build/lint/fmt/test を一括管理
- npmパッケージ名は `vite-plus`、グローバルCLIは `vp`
- 全設定を `vite.config.ts` に集約する（個別設定ファイルは非推奨）
- `vp migrate` で既存プロジェクトを移行可能（ただし手動調整が必要なケースが多い）
- Oxlint (ESLintの50-100x高速), Oxfmt (Prettierの30x高速), Vitest, Rolldown を統合

### skill作成時のポイント
- `user-invocable: false` で背景知識用のスキルを作れる（`/`メニューに出ない）
- 外部ツールのリファレンスをskill化する際、開発中ツールには変更可能性の注記を入れるべき
- 公式ドキュメントから情報を取得する場合、具体的なURLと記述を根拠として記録しておくとレビュー時のdismiss理由が書きやすい
