# Task: slack flavored markdownを適切に扱うための選択肢調査

## 達成条件

- 作業ディレクトリにresearch.mdとして調査結果が書かれていること
- Design Decisionに使えるレベルの情報が含まれていること（構文差異、ライブラリ比較、実装アプローチのpros/cons）

## 背景

現在のプロジェクトではSlackのmrkdwn形式のテキストをmarkdown-itで標準Markdownとして処理しているが、
構文の差異（`*bold*` vs `**bold**`等）があり正しくレンダリングされない。

## スコープ

- 調査のみ。実装は行わない
