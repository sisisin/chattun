# Task: frontの暗黙的な推移的依存を整理する

## 達成条件

- babel-runtime: emoji-mart 2.11.2が実質依存しているがpackage.jsonに宣言していない。emoji-martのアップデートで解消できるか検討し、可能ならアップデート、不可なら明示的依存として残す理由をコメントする
- @types/webpack-env: react-scriptsの推移的依存だがhoistingで消えうる。CRA→vite+移行時に不要になるため、移行完了後に削除する

## 背景

pnpm移行により厳格な依存解決になった。暗黙的な推移的依存（hoistingで偶然使えていたパッケージ）を明示化または削除する必要がある。
