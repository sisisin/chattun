# Task: レビュー＆動作確認スキルを整備する

## 達成条件
- browser-verifierエージェントがサブエージェントとして起動できる（現状 `Agent type 'browser-verifier' not found`）
- スキルのプロンプトが `<step>` 等のxml構造で読みやすくなっている
- ブラウザ動作確認が「任意」ではなく、front/配下の動きに関係する変更がある場合に実行される条件として明記されている
- task.mdにチェックリスト（`- [ ] review`, `- [ ] browser-verification`）が生成され、全チェック完了まで実行する動きになっている
- スキル名がレビュー＋動作確認をカバーする名前に変更されている

## 背景
- browser-verifier.mdはカスタムエージェント定義として存在するが、Claude CodeのAgent toolで利用可能なsubagent_typeには含まれない
- start-local-reviewのプロンプトが平文で読みにくい
- 「ブラウザ動作確認（任意）」の表記が誤解を招く
- レビューとブラウザ検証の進捗がtask.mdで追跡されていない

## スコープ
- browser-verifierの起動方法を修正（general-purposeエージェントにbrowser-verifier.mdの内容を渡す形にするか、別の方法を検討）
- start-local-review.mdのリファクタ（構造化、条件明確化、チェックリスト生成、リネーム）
