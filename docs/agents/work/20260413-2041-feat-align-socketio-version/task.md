# Task: server,frontでsocket.ioのバージョン揃ってないので是正して

## 原文

- Task: server,frontでsocket.ioのバージョン揃ってないので是正して

## 解釈

server側 `socket.io@4.8.3`、front側 `socket.io-client@4.7.5` でバージョンが不一致。socket.io-client を 4.8.x に更新してバージョンを揃える。

## 達成条件

- server の socket.io と front の socket.io-client が同じメジャー.マイナーバージョンになっている
- ビルドが通る
