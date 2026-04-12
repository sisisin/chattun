---
name: do-task
description: 'ユーザーの依頼をTODO.mdにタスクとして登録し、実行する。作業依頼・実装・修正・変更を求められたときに使う。'
argument-hint: '<やりたいことの説明>'
---

# タスク実行

ユーザーの依頼を `docs/agents/exectasks/TODO.md` にタスクとして登録し、実行する。

## 手順

### 1. 依頼の分析

$ARGUMENTS を分析し、達成すべきことを明確にする。不明な点があればユーザーに確認する。

### 2. タスク登録

`docs/agents/exectasks/TODO.md` の `# Tasks` セクションに新しいタスクを追記する。ファイル内で定義されているタスクリストのフォーマットに従う。

### 3. 実行

`docs/agents/exectasks/TODO.md` 内の exectasks-guide に従ってタスクを遂行する。
