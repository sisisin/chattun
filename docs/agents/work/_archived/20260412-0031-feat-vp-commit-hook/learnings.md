# Learnings

## vite-plusのgit hook機能

- `vp staged`がlint-staged相当の機能（vite.config.tsの`staged`ブロックで設定）
- `vp config`がhuskyのinstall相当（core.hooksPathを設定）
- hookファイルは`.vite-hooks/pre-commit`にコマンドを書く形式、`_/`配下のランナースクリプトは自動生成・gitignore済み
- monorepo/サブディレクトリ構成では、pre-commitスクリプト内で`cd "$(git rev-parse --show-toplevel)/front"`のように絶対パスで移動する必要がある（git hookはリポジトリルートから実行されるため）
- `prepare`スクリプトに`vp config`を入れることで、yarn install時に自動的にhookが有効化される
