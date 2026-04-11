# Done

- Task: Cloud Runのエラーログが構造化ログになっていない問題を修正する
  - Cloud Run上でSocket.IOのWebSocket接続（`/socket.io/?EIO=4&transport=websocket`）が500/503を返しているが、アプリケーション側の構造化ログと紐づいていない
  - Cloud Runのリクエストログ（`run.googleapis.com/requests`）のエラーに対応するアプリケーションログが構造化されていない可能性を調査・修正する

- Task: Socket.IO WebSocket接続で500/503エラーが発生する原因を調査し、原因不明の場合はアプリケーションが問題なく動作するよう修正する
  - 根本原因: unhandled rejection → Node.js exit(1) → Cloud Runインスタンスのクラッシュ連鎖
  - unhandledRejectionハンドラをトップレベルに追加し、プロセスをクラッシュさせずに構造化ログ記録するよう修正

- Task: 未認証ソケットのdisconnect時にクライアントへ適切に通知し、再接続ループを防止する
  - サーバー側: socket.disconnect(true)でクライアントに"io server disconnect"を送信（自動再接続されない）
  - クライアント側: disconnectイベントのreasonで判定し、セッション切れをalertで通知→/loginへリダイレクト

- Task: 別サーバーとしてモックサーバーを実装して、slack appをセットアップしなくてもFEが動くようにし、メッセージの見た目を確認できるようにする
  - 本番コードには手を入れず、`server/mock-server/` に独立したExpress+Socket.IOサーバーを作成
  - モックサーバーは認証不要で /api/connection にモックレスポンスを返し、Socket.IO で無条件接続を受け付け
  - モック用イベント発行httpエンドポイント（raw + プリセット）を実装
  - FE側は REACT_APP_MOCK_MODE 環境変数で MockSlackClient に切り替え、/api/mock/bootstrap からモックデータ取得
  - モック用アセット配信は express.static で実装

- Task: モックサーバーを利用した開発手順を/skill-dev を利用してclaude skillとして定義する
  - `.claude/skills/mock-dev/SKILL.md` を作成。start/preset/event/listの各サブコマンドに対応

- Task: Storybookを消す
  - @storybook/* パッケージ、storycap, story2sketch, reg-suit関連パッケージを削除
  - .storybook/ ディレクトリ、storiesファイル、utility/storybook/ ヘルパー、regconfig.json を削除
  - CSS内の.storybook-iconsクラス、ソース内のStorybook TODOコメント、eslintrcのstories override設定を削除
  - yarn.lock を更新

- Task: stylelintを消す
  - stylelint関連パッケージ6個を削除、スクリプト(stylelint, stylelint-fix)を削除
  - .stylelintrc.json, .stylelintignoreを削除
  - postcss.config.jsからstylelintプラグイン参照を削除、lint-staged.config.jsからstylelint参照を削除
  - yarn.lock を更新

- Task: lint-stagedを消す
  - lint-staged.config.jsを削除、package.jsonからhusky設定・lint-staged/huskyパッケージを削除
  - huskyはlint-staged専用のpre-commitフックのみだったため一緒に削除
  - yarn.lock を更新

- Task: vite+を調べて、最低限の概要と出来ることを /skill-dev を利用してskillとしてまとめる
  - .claude/skills/vite-plus/SKILL.md を作成（user-invocable: false、背景知識として自動参照）
  - CLIコマンド、vite.config.ts設定例、マイグレーション手順、パフォーマンス比較、ESLint/Prettier/Jest移行メモを記載
  - vite+公式からskillを得る方法（npx skills add）も確認したが、Claude Code標準のプラグイン仕組みとは異なるためプロジェクト内に直接作成

- Task: eslintを消し、vite+のlintに変更する
  - vite-plusを導入し、vite.config.tsにlint設定を集約（no-restricted-imports, react-hooks, typescript関連ルール）
  - eslint関連パッケージ(eslint-config-prettier, eslint-plugin-jest, eslint-plugin-prettier)・設定ファイル(.eslintrc.js, .eslintignore)を削除
  - craco.config.jsでCRA内蔵eslintを無効化、eslint-disableコメントをoxlint対応に置換
  - Node.jsを22.18.0に更新、lint結果は0 warnings 0 errors

- Task: slackをサーバーをプロキシとして叩くようにして、slack clientの依存を消す
  - サーバー側にSlack APIプロキシエンドポイント9個を追加（emoji.list, users.list, conversations.list, team.info, reactions.add/remove, conversations.replies/mark, auth.test）
  - フロントのSlackClient.tsをfetch()ベースのプロキシ呼び出しに書き換え
  - @slack/web-api, slack, os-browserify, path-browserifyをフロントから削除、craco.config.jsのpolyfill設定も整理
  - accessTokenのフロント返却を廃止、express.json()をグローバル配置、startRtmデッドコード削除
  - babel-runtime, @types/webpack-envをyarn hoisting変更対応として明示追加

- Task: oxlint移行時にsuppressしたlint ignoreを解消する
  - hooks.ts: useEffectの依存配列を修正、useActionsの不安定参照をuseRefパターンで安定化しexhaustive-deps suppressを削除
  - App.test.tsx: DefaultTypelessProviderをTypelessContext.Providerに移行しno-restricted-imports suppressを削除
