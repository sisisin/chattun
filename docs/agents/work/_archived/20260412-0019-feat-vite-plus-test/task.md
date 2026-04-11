# Task: テストをvite+に変更する

## 達成条件

1. テストランナーがcraco test (Jest) から vp test (Vitest) に変更されている
2. 既存のテストがすべてパスする
3. package.jsonのtestスクリプトが更新されている
4. Jest関連の依存・設定が不要であれば削除されている

## 背景

現在テストは`craco test`（内部的にJest）で実行されている。vite+はVitestを統合しているため、vp testに移行してツールチェーンを統一する。

## スコープ

- front/package.json のtestスクリプト
- vite.config.ts のtest設定（必要なら）
- 既存テストファイルの互換性確認・修正
