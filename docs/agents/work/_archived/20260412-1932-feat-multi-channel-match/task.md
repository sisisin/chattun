# Task: channel matchを複数設定できるようにする

## 達成条件

- 複数のchannel match条件を設定できる（例: startsWith `times-eng-` と startsWith `times-pdm-`）
- 各条件はOR結合（いずれかにマッチすればそのチャンネルを表示）
- 条件の追加・削除がUIから行える
- 既存の単一条件データとの後方互換性がある（localStorageに保存された旧データで壊れない）

## 背景

現状 `channelMatch` は `ChannelMatch | undefined` で単一条件のみ。複数の prefix で絞りたいケース（times-eng-*, times-pdm-* など）に対応できない。

## スコープ

- `TimelineSettings.ts`: `channelMatch` を配列型に変更
- `ChannelMatchSetting.tsx`: 複数条件の追加・削除UI
- `TimelineQuery.ts`: `filterMessages` のマッチロジックを複数条件OR対応
- `globalSetting/module.ts`: 後方互換の旧データマイグレーション
- `setting/module.tsx`: フォーム状態を配列対応

## 検証ステップ

- [x] review
- [x] browser-verification
