# Learnings: slack clientの依存削除

## yarn dependency hoisting の落とし穴

パッケージを削除すると、そのパッケージの推移的依存としてhoistされていた別パッケージも消える。
今回 `@slack/web-api` と `slack` を削除した結果、`babel-runtime`（emoji-martが暗黙的に依存）と `@types/webpack-env`（react-scriptsの推移的依存）が消えてビルドが壊れた。

対策: パッケージ削除後は必ずビルド確認すること。暗黙的依存の整理タスクをTODO.mdに追加済み。

## express.json() の配置位置

ルート定義の直前ではなくグローバルミドルウェアとして早期に配置すべき。将来的にPOSTルートを追加した際にreq.bodyがundefinedになるバグを防ぐ。
