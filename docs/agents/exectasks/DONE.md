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
