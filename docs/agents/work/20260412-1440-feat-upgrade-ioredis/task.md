# Task: ioredisを5.xにアップデートする

## 背景

ioredis 4.x → 5.x。v5で型が同梱されるため@types/ioredisが不要になる。

## 達成条件

1. ioredisを5.xにアップデート
2. @types/ioredisを削除
3. `pnpm vp run -r ci`が通る
4. Dockerビルドが通る

## スコープ

- server/package.json: ioredis更新、@types/ioredis削除
- 必要に応じてAPI変更への対応
