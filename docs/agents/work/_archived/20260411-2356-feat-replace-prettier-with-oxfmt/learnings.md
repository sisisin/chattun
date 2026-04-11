# Learnings: prettier→oxfmt移行

## oxfmtのprettierマイグレーション機能

`vp fmt --migrate=prettier`でprettierの設定をoxfmtに自動変換できる。ただしprettierの設定ファイルが存在しない場合はデフォルト値ベースで変換されるため、printWidthなどの値が既存コードの実態と合っているか確認が必要。

## CLAUDE.mdの同期

ツールチェーン変更時はCLAUDE.mdのコマンド説明も忘れずに更新する。
