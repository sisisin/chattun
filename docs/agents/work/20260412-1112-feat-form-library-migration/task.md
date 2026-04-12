# Task: react-hook-form を別のformライブラリを検討して移行する

## 達成条件

- react-hook-form の依存を除去し、フォーム処理を別の方法に移行する
- 既存のフォーム機能（ChannelMatch, KeywordMatch 設定）が正常に動作する
- 型チェック・lint・テストがパスする

## 背景

react-hook-form v5 を使用中。利用箇所は ChannelMatchSetting と KeywordMatchSetting の2ファイルのみで、`register` と `handleSubmit` のみ使用。usage が非常にシンプルなため、tanstack form 等のライブラリ導入ではなく、ネイティブ FormData API で十分と判断。

## スコープ

- `ChannelMatchSetting.tsx`: native FormData API に書き換え
- `KeywordMatchSetting.tsx`: native FormData API に書き換え
- `package.json`: react-hook-form を devDependencies から削除
