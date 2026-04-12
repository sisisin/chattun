# Task: ライト・ダークモード切り替えを設定できるようにする

## 背景

現在はOSのダークモード設定（`prefers-color-scheme`メディアクエリ）に追従するのみで、ユーザーが手動でテーマを選択できない。ライト/ダーク/システム（自動）の3択を設定画面で提供する。

## 設計

- `<html>` 要素に `data-theme="light"` or `data-theme="dark"` 属性を設定する
- CSSの `@media (prefers-color-scheme: dark)` を `[data-theme="dark"]` セレクタに置き換え
- `system` 選択時は `matchMedia('(prefers-color-scheme: dark)')` を監視して動的に切り替え
- テーマ適用はglobalSettingのepicで行う（設定変更時 + マウント時）

## 達成条件

1. TimelineSettings に `theme: 'system' | 'light' | 'dark'` を追加
2. 全CSSファイルの `@media (prefers-color-scheme: dark)` を `[data-theme="dark"]` に置き換え
3. globalSetting/module.ts でテーマ設定に応じて `<html data-theme>` を更新するロジックを実装
4. 設定画面に ThemeSetting コンポーネントを追加（ラジオボタン or select）
5. vp check が通ること

## 検証ステップ

- [x] review
- [x] browser-verification
