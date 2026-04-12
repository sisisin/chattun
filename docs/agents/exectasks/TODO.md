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
<step>`/verify` を実行し、レビュー＆動作確認ループが完了するまで修正する</step>
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

- Task: channel matchのバツボタンが小さい
  - これ直すのに合わせてコンポーネントのサイズや余白についてデザインガイドを引いて欲しい
- Task: mark as readはなくしちゃって、常にmark as readするようにしちゃう
- Task: ライト・ダークモード切り替えを設定できるようにする
- Task: 投稿者の名前表示を表示名の値を利用する
- Task: Tweetのチャンネル名表示をslackへのdeep linkとして、クリックしたら開けるようにする
- Task: alertなどのブロッキングする機能の利用をやめたい。そのためのアラート用コンポーネントを用意して載せ替える
- Task: channels listやらをサーバー側でキャッシュ
  - 毎回fetchしてるの無駄
- Task: 画像付き投稿のdeep linkが動かないので修正する
  - 問題が検討がつかない場合はユーザーに相談する必要があるため、一旦Backlogへ退避させてこのTaskをスキップする
- Task: slack flavored markdownを適切に扱えるようにする
  - 文法が違うので、結構レンダリングが壊れているのを是正する。しかしロバストな実現方法は検討の余地があるので設計を十分に検討すること
  - 設計判断に困った場合はユーザーに相談する必要があるため、一旦Backlogへ退避させてこのTaskをスキップする
- Task: スレッドかどうかを視覚的にわかりやすくする
  - 今はタイムライン画面で平たく表示されていて区別がつかないため、分かりにくい。スレッドであることが分かりやすくしたい
- Task: 設定項目を日本語にする
- Task: 自分へのメンションがハイライトされるようにする
- Task: pretteir.config.jsいらんくね？
- Task: pinactをmiseで入れて、pre commitで実行されるようにする
- Task: ciでvite-plusの公式アクションを利用するように修正する
  - https://viteplus.dev/guide/ci
- Task: pnpm installとかpnpm runをドキュメントからなくし、vp installのようにvpを利用することを前提に修正する
  - pnpm vpってやるのダルいんだけど、パスを通すいい方法ないんすかね
- Task: Dockerfileのリファクタリング
  - 近年はホストマシンのコードを持ってくるのにcopyを使わずキャッシュ付きmountとかを利用するらしい
  - 他にもあれば

# Backlog

着手条件が揃っていない、または優先度が低いタスク。Ready になったら Tasks セクションに移動する。
