# mrkdwnパーサーのregex評価結果

## 評価対象

前タスクで実装した `parser.ts` のregexベースパーサー

## 問題点

1. **巨大な単一正規表現**: `inlineRegex` が1行に全構文パターンを `|` で連結。今後メンション・絵文字・リンクを追加すると肥大化が加速
2. **キャプチャグループのインデックス管理**: `match[1]`〜`match[4]` のインデックスが構文追加のたびにずれる。バグの温床
3. **境界条件のlookbehind/lookahead**: 正規表現の可読性を著しく低下

## 判断: リファクタリング実施

文字走査（character-by-character scanning）ベースのパーサーに書き換え。

### 利点

- 各構文ルールが独立した関数（`isFormattingChar`, `findClosing`, `makeFormattingNode`）で局所的に修正可能
- 新構文追加は `isSpecialAt` への分岐追加 + メインループへのブロック追加のみ
- ネスト処理がスタック的に自然
- lookbehind不要（`isAtOpenBoundary`/`isAtCloseBoundary` で明示的に境界チェック）
