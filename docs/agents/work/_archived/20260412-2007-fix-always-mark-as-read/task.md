# Task: mark as readの設定を削除し、常にmark as readするようにする

## 背景

mark as readのON/OFF設定は不要。常にmark as readする動作にして、設定UIも消す。

## 達成条件

1. TimelineSettingsから `markAsRead` プロパティを削除
2. 設定画面からMarkAsReadSettingコンポーネントを削除
3. timeline/module.tsx の `Rx.filter(() => getGlobalSettingState().markAsRead)` を削除し、常にmark as readするようにする
4. globalSetting/module.ts の initialState と migrateSetting から markAsRead 関連を削除
5. setting/module.tsx の initialState から markAsRead を削除
6. vp check が通ること

## 検証ステップ

- [x] review
- [x] browser-verification
