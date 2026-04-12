---
description: Local review-fix loop until approved (max 5 rounds)
argument-hint: '[original task context / execplan step details]'
---

# Local Review Loop

Run an iterative review-fix loop on the current branch's changes. Repeat until approved or 5 rounds reached.

## Setup

Determine the review output file path:

```
docs/agents/work/{timestamp}-{branch-name}/review-{timestamp}.md
```

- `{branch-name}`: current branch name (slashes replaced with `-`, e.g. `feat/foo` → `feat-foo`)
- `{timestamp}`: current time formatted as `YYYYMMDD-HHmm`

Determine these values once at setup. Use the same file path throughout all rounds (do not recalculate, to keep all rounds in a single file).

## Task

Execute the following loop. **You (main agent) must NOT read the diff or changed files yourself.** Only the reviewer subagent reads the code.

### Loop (max 5 rounds)

#### Review Phase

Use the **Agent tool** with `subagent_type: "local-reviewer"` to spawn the reviewer subagent with the following prompt:

> Review the current branch's changes.
>
> Append the review result as `## Round N` to: {review output file path}
>
> Task definition: docs/agents/work/{timestamp}-{branch-name}/task.md（存在する場合。レビューはこのTaskが達成されているかの観点で行うこと）
>
> Task context: {$1 の内容}
>
> Review history: {Round 2+ の場合、レビューファイルパスを記載。Round 1 なら「なし」}

#### Browser Verification (optional)

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
> Output file: {review output file path}
> Section heading: `## Browser Verification`

#### Fix Phase (if NEEDS_FIX)

For each finding, either fix or dismiss with reason:

- **Fix**: Apply the fix and commit with message: `fix: address local review round N findings`
- **Dismiss**: Append a `### Dismissed` section to the review file with the finding number and justification

The reviewer will evaluate dismissed findings in the next round and accept valid justifications.

#### Completion

When the reviewer outputs `STATUS: APPROVED` or 5 rounds are reached:

1. Archive and commit the review result:
   - Move the work directory to `docs/agents/work/_archived/`: `mv docs/agents/work/{timestamp}-{branch-name} docs/agents/work/_archived/`
   - `git add docs/agents/work/`
   - Commit with message: `docs: add local review result for {branch-name}`
   - Push with `./tools/git/git-push.sh`
2. Report summary:

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
