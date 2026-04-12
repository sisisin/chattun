---
description: コードレビュー＋ブラウザ動作確認ループ（最大5ラウンド、全チェック完了まで繰り返し）
argument-hint: '[タスクの内容 / execplan のステップ詳細]'
---

# コードレビュー＆動作確認

現在のブランチの変更に対してコードレビュー・修正・ブラウザ動作確認を実行する。

<setup>
<step>レビュー出力ファイルのパスを決定する</step>

```
docs/agents/work/{timestamp}-{branch-name}/review-{timestamp}.md
```

- `{branch-name}`: 現在のブランチ名（スラッシュは `-` に置換、例: `feat/foo` → `feat-foo`）
- `{timestamp}`: 現在時刻を `YYYYMMDD-HHmm` 形式でフォーマット
- これらの値はセットアップ時に一度だけ決定し、全ラウンドを通じて同じファイルパスを使う

<step>検証対象を判定し、task.md にチェックリストを生成する</step>

`git diff main...HEAD --name-only` の結果から検証対象を判定する:

- **review**: 常に対象
- **browser-verification**: `front/src/` 配下のファイル（`.ts`, `.tsx`, `.css`）が含まれる場合に対象

task.md に `## 検証ステップ` セクションを追記する（既にあれば上書き）:

```markdown
## 検証ステップ

- [ ] review
- [ ] browser-verification
```

browser-verification が対象外の場合は review のみのチェックリストにする。

</setup>

<loop max-rounds="5">

主エージェントは diff や変更ファイルを自分では読まない。コードを読むのはレビューサブエージェントだけ。

<step name="review">レビューフェーズ</step>

**Agent ツール**（`subagent_type: "local-reviewer"`）でレビューサブエージェントを起動する:

```
Review the current branch's changes.

Append the review result as `## Round N` to: {レビュー出力ファイルパス}

Task definition: {task.mdのパス}（存在する場合。レビューはこのTaskが達成されているかの観点で行うこと）

Task context: {$1 の内容}

Review history: {Round 2以降ならレビューファイルパスを記載。Round 1 なら「なし」}
```

<step name="fix">修正フェーズ（NEEDS_FIX の場合）</step>

各指摘について、修正するか dismiss するか判断する:

- **修正**: 修正を適用し、コミットメッセージ: `fix: address review round N findings`
- **Dismiss**: レビューファイルに `### Dismissed` セクションを追記し、指摘番号と理由を記載

レビューアーは次のラウンドで dismiss された指摘を評価し、理由が妥当であれば受け入れる。

NEEDS_FIX の場合はループの先頭（レビューフェーズ）に戻る。

<step name="review-approved">レビュー承認時の処理</step>

レビューアーが `STATUS: APPROVED` を出力したら、task.md のチェックリストで `review` にチェックを入れる:

```markdown
- [x] review
```

</loop>

<step name="browser-verification">ブラウザ動作確認</step>

**実行条件**: task.md のチェックリストに `browser-verification` が含まれる場合のみ実行する。

**前提**: devサーバー（port 3000）とモックサーバー（port 3100）が起動していること。起動していなければ以下で起動する:
- `cd server && pnpm dev:mock &`
- `cd front && VITE_MOCK_MODE=true pnpm start &`

general-purpose エージェントを起動し、`.claude/agents/browser-verifier.md` の手順に従わせる:

```
フロントエンドの動作検証を行ってください。

まず `.claude/agents/browser-verifier.md` を読んで、そこに書かれた手順に従って検証を進めてください。

Task context: {タスクの内容}

Output file: {レビュー出力ファイルパス}
Section heading: `## Browser Verification`
```

検証完了後、task.md のチェックリストで `browser-verification` にチェックを入れる。
ISSUES_FOUND の場合は問題を修正してコミットし、再度ブラウザ検証エージェントを起動する。

<step name="complete">完了</step>

task.md のチェックリストがすべてチェック済みになったら:

1. レビュー結果をアーカイブしてコミット:
   - 作業ディレクトリを `docs/agents/work/_archived/` へ移動: `mv docs/agents/work/{timestamp}-{branch-name} docs/agents/work/_archived/`
   - `git add docs/agents/work/`
   - コミットメッセージ: `docs: add review result for {branch-name}`
   - `git push` でプッシュ
2. サマリーを報告:

```
---
## 検証完了

**Rounds**: N/5
**Result**: ✅ APPROVED / ⚠️ MAX_ROUNDS_REACHED

### チェックリスト
- [x] review — Round N で APPROVED
- [x] browser-verification — STATUS: OK

### Round Summary
- Round 1: [findings count] 件の指摘 → 修正 N 件 / dismiss N 件
- Round 2: APPROVED
---
```
