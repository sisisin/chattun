# Task: tsconfig.jsonのstrictFunctionTypesをtrueにする

## 達成条件

- tsconfig.jsonのstrictFunctionTypesをtrueに変更する
- 型エラーが発生する箇所を修正する
- `tsc --noEmit`、`vp check`、`vp test run`が全てパスすること

## 背景

現在strict: falseでstrictFunctionTypes: false。他のstrict系オプションは個別にtrue設定済み。strictFunctionTypesを有効にして関数引数の反変チェックを追加し、型安全性を向上する。
