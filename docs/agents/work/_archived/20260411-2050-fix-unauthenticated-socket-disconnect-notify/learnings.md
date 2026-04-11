# Learnings

## Socket.IO の disconnect(true) と自動再接続
- サーバー側の `socket.disconnect(true)` はクライアントに `"io server disconnect"` という reason を送る
- この reason の場合、Socket.IO クライアントは自動再接続しない（手動で `socket.connect()` を呼ぶ必要がある）
- emit + disconnect の順序問題を避けるため、カスタムイベントよりも disconnect の reason で制御する方が確実

## emit 直後の disconnect の注意点
- `socket.emit()` の直後に `socket.disconnect()` を呼ぶと、emit したパケットがフラッシュされる前に接続が切断される可能性がある
- サーバーからクライアントへの通知+切断が必要な場合は、ack コールバックを使うか disconnect の reason で制御する
