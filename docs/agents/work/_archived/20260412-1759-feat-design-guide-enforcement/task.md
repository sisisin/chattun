# Task: デザインガイドを実装レベルで利用・守れるように整備する

## 達成条件

1. frontend-development skillが作成され、UI designが必要な場合にdesign.mdを追加で読むよう誘導する内容が含まれている
2. design.mdに実装上守るべき内容（またはdocs/guide/ui-design.mdへのリンク）が記載されている
3. local-reviewer agentのレビュー指針に「変更範囲に対応したskillを参照して、それを守っているかをレビューする」という内容が盛り込まれている

## 背景

docs/guide/ui-design.mdにデザインガイドが作成されたが、実装時にこれを参照・遵守する仕組みがない。
skillとレビュー指針を整備することで、デザインガイドが実装レベルで守られるようにする。

## スコープ

- /skill-dev skillを利用してfrontend-development skillを作成する
- design.mdにデザインガイドの実装ルールを記載（またはリンク）
- local-reviewer agentにskill参照によるレビュー指針を追加
