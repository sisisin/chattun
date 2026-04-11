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
5. 1 へ戻る

</guidance>
<task-execution>
各 Task の実装は以下の流れで進める：

<steps>
<step>作業ディレクトリを `docs/agents/work/{yyyymmdd-hhmm}-{branch-name}/` の形式で作成する（branch-name のスラッシュはハイフンに置換）</step>
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

- Task: hooks.tsのuseEffect依存配列を元の[]に戻し、exhaustive-deps suppressを復元する
  - マウント時に1回だけIntersectionObserverを登録する意図であり、空配列が正しい
  - useRefパターンへの変更は不要だったので元に戻す
- Task: DockerfileのNodeバージョンを22.18.0に更新してデプロイ失敗を修正する
  - package.jsonのengines.nodeが^22.18.0に変更されたが、Dockerfileはnode:22.11.0のまま
  - https://github.com/sisisin/chattun/actions/runs/24284859037/job/70912452823
- Task: prettierを消し、vite+のformatterに変更する
- Task: 開発用コマンドをvite+タスクに定義して、そちらを利用する形にする。npm-run-allは多分vite+があれば十分なので消す
- Task: テストをvite+に変更する
- Task: create-react-appをvite+へ移行する。画面が正常に表示できることを確認する
  - create-react-app関連の依存はちゃんと消すこと
  - Taskが大きすぎて対応しきれない場合は、作業を分解してそれぞれTaskとして追加すること
- Task: typescriptを最新にする
- Task: frontのみyarnからpnpmへ移行
- Task: CSSをvite+で利用できる技術に移行し、postcssを消す
- Task: frontの暗黙的な推移的依存を整理する
  - babel-runtime: emoji-mart 2.11.2が実質依存しているがpackage.jsonに宣言していない。emoji-martのアップデートで解消できるか検討し、可能ならアップデート、不可なら明示的依存として残す理由をコメントする
  - @types/webpack-env: react-scriptsの推移的依存だがhoistingで消えうる。CRA→vite+移行時に不要になるため、移行完了後に削除する
- Task: 他にfrontでモダナイズが必要な点がないかをレビューし、その結果得られた必要であろう作業をTaskとして追加する

# Backlog

着手条件が揃っていない、または優先度が低いタスク。Ready になったら Tasks セクションに移動する。
