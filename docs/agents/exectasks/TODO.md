<exectasks-guide>
<overview>
ExecTasksは自己完結的なタスク遂行ドキュメントです。このファイルはタスク遂行の方法及び進捗管理に利用します
必ず最新に保ち、compactする際にもこのドキュメントを最重要項目として参照を維持してください
</overview>
<guidance>
ExecTasks の実行を指示されたら、auto memory に実行中の ExecTasks のパスを記録する（例: `- ExecTasks 実行中: docs/agents/exectasks/TODO.md`）
メモリに参照を書いたら、以下の流れでタスクを遂行する

1. TODO.md から着手可能な Task を特定する
2. ブランチカット
3. Task の完了条件を満たすまで実装を行う
4. 完了条件を満たせたら main ブランチへマージし、pushする
5. GitHub Actions のデプロイ/CIが成功しているか `gh run list` 等で確認する。失敗していたら修正Taskを追加し、先に遂行する
6. 1 へ戻る

</guidance>
<task-execution>
各 Task の実装は以下の流れで進める：

<steps>
<step>作業ディレクトリを `docs/agents/work/{yyyymmdd-hhmm}-{branch-name}/` の形式で作成する（branch-name のスラッシュはハイフンに置換）</step>
<step>作業ディレクトリに `task.md` を作成し、遂行するTaskの内容（達成条件、背景、スコープ）を記述する。ローカルレビュワーがこのファイルを参照してレビューする</step>
<step>Taskを満たすよう修正を入れる</step>
<step>`/start-local-review` を実行し、レビューをうけ、レビューループが完了するまで修正する</step>
<step>Approveされたら、Task遂行上の障害になったことや学びを作業ディレクトリの `learnings.md` に記載し、その中で仕組として実装して解決出来そうなことは新たなTaskとして追記する</step>
<step>Taskを DONE.md に移動し、コミットして main へマージする</step>
</steps>

途中、Task 遂行を達成できないような状況になった場合（e.g. レビューが Approve されない・現在の状況では解決できない問題があったなど）、該当 Task の実施は中断する
中断した Task は Backlog セクションに移動し、中断理由と実装ブランチ名を付記する

</task-execution>

<operation-rules>
追加の重要な情報（調査結果、設計詳細など）は作成した作業ディレクトリ内に別ファイルを作って記録すること
実装中に得た知見（APIの挙動、ハマりポイント、有用なパターンなど）や実行中の注目イベント（CI失敗、レビュー指摘、計画変更、ユーザー介入など）は作業ディレクトリの `learnings.md` に随時記録すること
Task 完了時、マージ前に作業ディレクトリを `docs/agents/work/_archived/` へ移動すること
</operation-rules>
<task-list-format>

以下のようなリストとして記述する。 `- Task: ` のようにして Task を説明する

```
- Task: [達成したいことを簡潔に述べた1文]
  - [背景、補足、想定する設計について必要性が認められる場合に限りサブインデントで記述。なるべく使用を避け、表題で述べる]
  - [Task内で実現したい作業が複数あればサブインデントで記述]
```

</task-list-format>
</exectasks-guide>

# Tasks

- Task: move-assetsいらなそう。docker build直せば良さげ
- Task: serverのnpm scriptsをvp task化
  - githookなど、front/特化になっていたところも、Workspace前提で統合して扱えるようにする
  - あわせてvp taskをrepo rootで扱う、Workspace運用に変更する
- Task: typescriptなどの共通の依存をrootに移動し、個別のWorkspaceパッケージは自分の必要な分だけ持つようにする
- Task: serverでモダナイズが必要な点がないかをレビューし、その結果得られた必要であろう作業をTaskとして追加する
- Task: scripts/,docker/をtools/へ統合する。スクリプトの置き方は役割に沿った構成になるように調節
- Task: .vscodeをルートに統合・chattun.code-workspaceを消す
- Task: なんか古いやつが地味に残ってるのを消す
  - たとえばmise.tomlにyarnがいる
- Task: /.env.localにサーバー用の環境変数を渋々置いてるんだけど、サーバー開発時にserver/.env.localが適切に評価されるようにしたい
  - 依存増やさない方法が一番いい
- emoji-martのアセットが500kb超えてるっぽいので、UXの最適化をする
  - 単独でエンドポイントから配信するようにしてbundleに入れない・キャッシュされやすくするとか？（なんもわからん）

# Backlog

着手条件が揃っていない、または優先度が低いタスク。Ready になったら Tasks セクションに移動する。
