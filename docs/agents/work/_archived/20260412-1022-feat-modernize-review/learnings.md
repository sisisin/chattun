# Learnings

## story2sketch.config.js
- Storybook削除時に取り残された設定ファイル。Storybook関連は以前のタスクで削除済みだが見落とし

## buffer/process パッケージ
- CRA時代にNode.jsポリフィルとして必要だった。Vite移行後はソースコードで直接import無し
- vite.config.tsの`define: { 'process.env': '{}' }`は残すが、パッケージ自体は不要

## postcss plugins
- browserslist設定が`>0.2%, not dead, not ie <= 11, not op_mini all`なので、CSS nesting・custom mediaはネイティブで十分
- autoprefixerのみ残す価値がある

## tsconfig strict
- strict: false だが個別に noImplicitAny, strictNullChecks, strictPropertyInitialization, noImplicitReturns, noImplicitThis, alwaysStrict を有効にしている
- strictFunctionTypes と strictBindCallApply のみ無効。strictFunctionTypesを有効にするのが次のステップ
