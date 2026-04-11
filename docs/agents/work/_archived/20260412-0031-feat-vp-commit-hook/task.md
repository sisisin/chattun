# Task: vpにlint-staged的な機能があるか調査し、commit hookを設定する

## 達成条件

1. vpにlint-staged相当の機能があるか調査結果が明確になっている
2. commit hook（pre-commit）でlint/formatチェックが実行される仕組みが導入されている
   - vpにその機能があればvpの機能を利用
   - なければlefthookを導入してvp checkを実施
3. hookが正常に動作する（コミット時にチェックが走る）

## 背景

以前lint-stagedとhuskyを削除した。commit時の品質チェックを再導入したい。vite+にその機能があれば統一的に使いたい。

## スコープ

- vite+のドキュメント/機能調査
- pre-commit hook設定
- 必要に応じてlefthookの導入
