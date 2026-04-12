# Task: ブラウザ動作確認エージェントを独立定義し、local-reviewのBrowser Verification Phaseを置き換える

## 達成条件

- `.claude/agents/browser-verifier.md` にブラウザ動作確認エージェントを定義
- `start-local-review.md` から Browser Verification Phase セクションを削除
- local-review や ExecTasks のフローから、必要に応じてエージェントを起動できる形にする

## 背景

現在 local-review の中に Browser Verification Phase としてインラインでブラウザ検証手順が埋め込まれている。
これを独立したエージェント定義に切り出すことで、local-review 以外の文脈（手動起動、ExecTasks等）からも利用可能にする。

## スコープ

- `.claude/agents/browser-verifier.md` を新規作成
- `.claude/commands/start-local-review.md` から Browser Verification Phase を削除し、エージェントへの参照に置き換え
