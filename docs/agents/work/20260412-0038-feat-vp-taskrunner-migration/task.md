# Task: npm scriptsを空にして全てvp taskrunner機能に寄せる

## 達成条件

1. 可能な限りのnpm scriptsがvite.config.tsのrun.tasks定義に移行されている
2. vp run --parallel相当をconfigで表現できるか調査結果が明確
   - 可能ならconfig定義に移行
   - 不可能ならそのスクリプトだけnpm scriptsに残す
3. package.jsonのscriptsが最小限になっている
4. 既存の開発フロー（start, build, test, lint, format等）が引き続き動作する

## 背景

現在package.jsonのscriptsに多くのコマンドが定義されているが、vp taskrunnerで一元管理できるものはconfig側に寄せたい。

## スコープ

- front/package.json のscripts
- front/vite.config.ts のrun.tasks
- CLAUDE.md の開発コマンド説明
