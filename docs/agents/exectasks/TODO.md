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
<step>作業ディレクトリに `task.md` を作成し、遂行するTaskを転記する。それから達成条件、スコープを記述する。Task定義の原文をそのまま持ってくるセクションと、それを解釈したセクションを区別すること。ローカルレビュワーはこのファイルを参照してレビューする</step>
<step>Taskを満たすよう修正を入れる</step>
<step>`/verify` を実行し、レビュー＆動作確認ループが完了するまで修正する</step>
<step>Approveされたら、Task遂行上の障害になったことや学びを作業ディレクトリの `learnings.md` に記載し、その中で仕組として実装して解決出来そうなことは新たなTaskとして追記する</step>
<step>Taskを DONE.mdの一番上に移動し、対応work directoryへのリンクを行末に追記する。その後、コミットして main へマージする
例:
- Task: 〜する [{yyyymmdd-hhmm}-{branch-name}](../work/_archived/[{yyyymmdd-hhmm}-{branch-name}])
</step>
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

- Task: useTweetModuleをTimelineViewで実行してるのは誤り。.blueprintで出力するfeatureの構造を確認して、適切な構造に整理して。module.tsxがTweetというComponentを定義してその中で利用するのが正しい。そして今のTweet ComponentはTweetViewという名前にするのが適切でしょう
  - featureの構造をskillに落とすのもやっておいて
- Task: user muteとtimeline filterのロジックが散ってるので集約して
- Task: main.cssで個別コンポーネント向けのcssをimportするのをやめる
  - 局所化するべき
  - この内容をfrontend-development skillに記載するのもやる
- Task: server,frontでsocket.ioのバージョン揃ってないので是正して
- Task: typelessのバージョン最新にしておいて
- Task: OutsideClickが簡単に実装できるならreact-outside-click-handler消しちゃって。実装が複雑であれば残していいよ
- Task: serverのindex.tsがゴチャ付いてるので整理したい。少なくとも`/api/*` は分けたい
  - src/router/とか切ってapiRouter変数をexportしてindex.tsでuseするとか
- Task: typescript 6でdeprecation warnが出ている部分を修正する
  - 大規模になる場合、スコープごとにTaskを切り出して対応する形でも可

# Backlog

着手条件が揃っていない、または優先度が低いタスク。Ready になったら Tasks セクションに移動する。

- Task: docs/agents/work/\_archived/20260413-0022-feat-unify-menu-route-definitions/research.md を元に意思決定し、Menu定義とRoute定義の統合リファクタリングを行う
  - 画面数が増えたタイミングで着手するのが適切
