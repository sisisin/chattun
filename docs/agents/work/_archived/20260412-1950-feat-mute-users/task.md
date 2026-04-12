# Task: keyword matchをmute機能にリネーム・リデザインする

## 達成条件

- 「Keyword Match」を「ミュート」にリネーム
- ユーザー名マッチに特化する（テキスト内容のマッチは行わない）
- 複数条件が設定できる（channel matchと同じパターン）
- placeholderに「Devin」を表示
- フィルタロジックはdisplayName/fullNameのみ対象（textは含めない）
- 既存のkeywordMatchデータとの後方互換性

## 背景

keyword matchは名前が直感的でなく、実際の主要ユースケースはslack bot（Devin, Difyなど）のミュート。
ユーザー名マッチに特化し、複数条件対応にすることで使いやすくする。

## スコープ

- `TimelineSettings.ts`: `keywordMatch` → `mutedUsers: string[]` に変更
- `KeywordMatchSetting.tsx` → `MuteUsersSetting.tsx` にリネーム・UIリデザイン
- `TweetList.tsx`: フィルタロジックをdisplayName/fullNameマッチに変更
- `SettingView.tsx`: コンポーネント参照の更新
- `globalSetting/module.ts`: 旧データのマイグレーション
- `setting/module.tsx`: initialState更新

## 検証ステップ

- [x] review
- [x] browser-verification
