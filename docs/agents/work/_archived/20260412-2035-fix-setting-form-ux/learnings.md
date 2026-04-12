# Learnings

## createPortal内のkey変更でReactは再マウントする

`createPortal(<div key={version}>...</div>, document.body)` でkeyが変わるとReactはdiv要素を再マウントする。ポータル越しでも通常のReact reconciliationルールが適用される。CSSアニメーション再トリガーに有効。

## 保存ボタンの disabled 制御パターン

`hasChanges(local, stored) && !hasEmptyValues(local)` で変更ありかつ全入力が有効な場合のみ保存可能にする。これによりhandleSave内の防衛的フィルタリングが不要になる。
