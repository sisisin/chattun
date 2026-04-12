# Task: 古い残骸を消す

## 達成条件

- 古いツール・プラットフォーム（yarn, circleci, heroku）への参照が除去されていること
- README.mdの情報が現在の構成（GCP Cloud Run, pnpm, GitHub Actions）と整合していること
- vp checkが通る

## 背景

過去のマイグレーション（yarn→pnpm, Express→Hono, heroku→GCP Cloud Run, circleci→GitHub Actions）の残骸がREADME等に残っている。
mise.tomlのyarnは既に除去済み。主にREADMEの古い記述を整理する。
