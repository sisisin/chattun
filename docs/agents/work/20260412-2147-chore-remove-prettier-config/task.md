# Task: prettier.config.jsの削除

## 達成条件

- `front/prettier.config.js` が削除されていること
- 削除後もビルド・lint・テストが正常に通ること

## 背景

Prettierは既にvite+のformatter(oxfmt)に移行済み。`front/prettier.config.js` はどこからも参照されていない残骸ファイル。

## スコープ

- `front/prettier.config.js` の削除のみ
