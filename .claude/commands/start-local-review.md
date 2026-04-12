---
description: ローカルレビュー・修正ループ（最大5ラウンド、承認まで繰り返し）
argument-hint: '[タスクの内容 / execplan のステップ詳細]'
---

# ローカルレビューループ

現在のブランチの変更に対してレビュー・修正ループを実行する。承認または5ラウンド到達まで繰り返す。

## セットアップ

レビュー出力ファイルのパスを決定する:

```
docs/agents/work/{timestamp}-{branch-name}/review-{timestamp}.md
```

- `{branch-name}`: 現在のブランチ名（スラッシュは `-` に置換、例: `feat/foo` → `feat-foo`）
- `{timestamp}`: 現在時刻を `YYYYMMDD-HHmm` 形式でフォーマット

これらの値はセットアップ時に一度だけ決定する。全ラウンドを通じて同じファイルパスを使う（再計算しない）。

## タスク

以下のループを実行する。**主エージェントは diff や変更ファイルを自分では読まない。** コードを読むのはレビューサブエージェントだけ。

### ループ（最大5ラウンド）

#### レビューフェーズ

**Agent ツール**（`subagent_type: "local-reviewer"`）でレビューサブエージェントを起動する:

> Review the current branch's changes.
>
> Append the review result as `## Round N` to: {レビュー出力ファイルパス}
>
> Task definition: docs/agents/work/{timestamp}-{branch-name}/task.md（存在する場合。レビューはこのTaskが達成されているかの観点で行うこと）
>
> Task context: {$1 の内容}
>
> Review history: {Round 2以降ならレビューファイルパスを記載。Round 1 なら「なし」}

#### ブラウザ動作確認（任意）

**実行条件**: `git diff main...HEAD --name-only` に `front/src/` 配下のファイル（`.ts`, `.tsx`, `.css`）が含まれる場合のみ。

**実行タイミング**: レビュー APPROVED 後、マージ前に実行する。

**前提**: devサーバー（port 3000）が起動していること。起動していなければ呼び出し元が `cd front && pnpm start` で起動する。

`browser-verifier` エージェントを起動する:

> Agent(subagent_type: "browser-verifier")
>
> フロントエンドの動作検証を行ってください。
>
> Task context: {タスクの内容}
>
> Output file: {レビュー出力ファイルパス}
> Section heading: `## Browser Verification`

#### 修正フェーズ（NEEDS_FIX の場合）

各指摘について、修正するか dismiss するか判断する:

- **修正**: 修正を適用し、コミットメッセージ: `fix: address local review round N findings`
- **Dismiss**: レビューファイルに `### Dismissed` セクションを追記し、指摘番号と理由を記載

レビューアーは次のラウンドで dismiss された指摘を評価し、理由が妥当であれば受け入れる。

#### 完了

レビューアーが `STATUS: APPROVED` を出力するか、5ラウンドに到達した場合:

1. レビュー結果をアーカイブしてコミット:
   - 作業ディレクトリを `docs/agents/work/_archived/` へ移動: `mv docs/agents/work/{timestamp}-{branch-name} docs/agents/work/_archived/`
   - `git add docs/agents/work/`
   - コミットメッセージ: `docs: add local review result for {branch-name}`
   - `git push` でプッシュ
2. サマリーを報告:

   ```
   ---
   ## Local Review 完了

   **Rounds**: N/5
   **Result**: ✅ APPROVED / ⚠️ MAX_ROUNDS_REACHED

   ### Round Summary
   - Round 1: [findings count] 件の指摘 → 修正 N 件 / dismiss N 件
   - Round 2: APPROVED
   ---
   ```
