# Done

- Task: Cloud Runのエラーログが構造化ログになっていない問題を修正する
  - Cloud Run上でSocket.IOのWebSocket接続（`/socket.io/?EIO=4&transport=websocket`）が500/503を返しているが、アプリケーション側の構造化ログと紐づいていない
  - Cloud Runのリクエストログ（`run.googleapis.com/requests`）のエラーに対応するアプリケーションログが構造化されていない可能性を調査・修正する

- Task: Socket.IO WebSocket接続で500/503エラーが発生する原因を調査し、原因不明の場合はアプリケーションが問題なく動作するよう修正する
  - 根本原因: unhandled rejection → Node.js exit(1) → Cloud Runインスタンスのクラッシュ連鎖
  - unhandledRejectionハンドラをトップレベルに追加し、プロセスをクラッシュさせずに構造化ログ記録するよう修正
