# Task: serverのnpm scriptsをvp task化 + repo root運用

## 達成条件

- server に vite.config.ts を追加し、npm scripts を vp tasks に移行
- repo root で `pnpm vp run` できるようにし、workspace 全体のタスクを管理
- git hooks を repo root から実行する形に変更（front 特化から workspace 対応へ）
- pre-push で front の build+test-all と server の型チェックを実行
- Docker ビルド、CI が引き続き成功する

## スコープ

- `server/vite.config.ts` 作成（run.tasks 定義）
- `server/package.json` の scripts を vp tasks に移行
- repo root から workspace 全体の操作ができる形に
- git hooks の workspace 対応
- Dockerfile、CI、CLAUDE.md 更新
