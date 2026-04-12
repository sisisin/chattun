# Task: npm scripts, vp tasksの簡素化

## 達成条件

- 不要になった`-js`サフィックス等の冗長なタスク名を整理する
- vite.config.tsのrun.tasksとpackage.jsonのscriptsを必要最小限にする
- CI, Dockerfile, CLAUDE.md等の参照を更新する

## 背景

CRA→vite+移行、CSS/SWビルドのVite統合を経て、build-jsなどの`-js`サフィックスやCSS/SW個別タスクが不要になった。タスク名とスクリプト構成をシンプルにする。
