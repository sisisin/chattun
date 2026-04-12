# Task: 不要なファイル・パッケージを削除する

## 達成条件

- story2sketch.config.js（Storybook削除後の残骸）を削除
- buffer, processパッケージ（CRA時代のpolyfill、ソースコードで未使用）をdevDependenciesから削除
- pnpm-lock.yamlを更新
- ビルド・テストが引き続き通ること
