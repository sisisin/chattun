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

- Task: 「スレッドを表示」が各種アクションボタンより下に配置されていて、ボタンの下側の余白が広すぎる。同じ高さにあるのが良いでしょう
- Task: 画像付き投稿のdeep linkが動かないので修正する
  - tmp/examples/message-with-image.json にdeeplinkに失敗するmessageのjsonを置いたので参考にすること
- Task: front/src/app/components/Routes.tsx で一段コンポーネント挟む理由ないのでなくして
- Task: Menuで定義してる画面ごとの表示とRouteごとの表示コンポーネント定義を同じ場所で定義できるようにしたい。可能かどうかを検討して具合のいい方法があれば実装して。迷うようであればresearchとして検討結果をまとめて、Backlogにpath/to/research.mdを元に意思決定した形でリファクタリングする、というアイテムを追加して
- Task: Timeline,TweetList,Tweet,slack/SlackQuery,mrkdwnらへんがちょっとロジックが散逸してて見通しが悪いので整理して
  - 特にTweetListはtypeless moduleの実装がすっからかんなので、timelineに寄せて良いと思う
  - TweetのBody部分をTweetBodyとかにして、そのなかにmrkdwnとかを押し込めたほうがよさそう
  - SlackQueryに実装されてる関数が、selectorだったりTweet系コンポーネント向けの関数だったりでばらつきがありそう。selectorはselector.tsって名前にして置いてあるほうが良さそう（他の\*Query.ts系全般に言える）
- Task: server,frontでsocket.ioのバージョン揃ってないので是正して
- Task: typelessのバージョン最新にしておいて
- Task: OutsideClickが簡単に実装できるならreact-outside-click-handler消しちゃって。実装が複雑であれば残していいよ
- Task: serverのindex.tsがゴチャ付いてるので整理したい。少なくとも`/api/*` は分けたい
  - src/router/とか切ってapiRouter変数をexportしてindex.tsでuseするとか
- Task: typescript 6でdeprecation warnが出ている部分を修正する
  - 大規模になる場合、スコープごとにTaskを切り出して対応する形でも可

# Backlog

着手条件が揃っていない、または優先度が低いタスク。Ready になったら Tasks セクションに移動する。
