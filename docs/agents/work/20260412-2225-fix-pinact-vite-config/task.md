# Task: pre-commitのpinact実行をvite.config.tsのstaged設定に移す

## 達成条件

- vite.config.tsのstaged設定に `.github/**` パターンで `pinact run` が定義されていること
- .vite-hooks/pre-commitからpinact関連のコードが削除されていること
- `mise x` でのラップが不要になっていること

## 背景

pinactのpre-commit実行が`.vite-hooks/pre-commit`にシェルスクリプトとして直書きされていたが、
vite.config.tsのstaged設定を使えば、他のlint/format設定と統一的に管理できる。
また、miseがactivateされた環境ではpinactがPATHに入っているため、`mise x`は不要。

## スコープ

- vite.config.ts に `.github/**` の staged 設定追加
- .vite-hooks/pre-commit からpinact関連コード削除
