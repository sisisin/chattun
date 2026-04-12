# Task: 設定画面にdeveloper modeのチェックを追加

## 達成条件
- 設定画面の一番下にDeveloper Modeチェックボックスが表示される
- trueの場合、Tweet上のデバッグ用コピーボタン（Cボタン）が表示される
- `localStorage.getItem('EC')` による直接参照がglobalSetting経由に置き換わる
- 既存の設定保存・復元フローが維持される

## 背景
- 現在は`localStorage.getItem('EC') === '1'`でデバッグ用コピーボタンの表示を直接制御している
- これを設定画面のチェックボックスで制御できるようにし、localStorageの直接操作を不要にする

## スコープ
- TimelineSettings型にdeveloperMode: booleanを追加
- globalSettingModuleでdeveloperModeを参照可能にする
- 設定画面にDeveloperModeSettingコンポーネントを追加（一番下）
- Tweet.tsxのlocalStorage参照をglobalSetting経由に変更
