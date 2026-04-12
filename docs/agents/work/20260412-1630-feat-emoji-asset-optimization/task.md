# Task: emoji-martのアセット最適化

## 達成条件

- @emoji-mart/dataが初期バンドルに含まれないこと（遅延ロード化）
- emoji picker機能が正常に動作すること
- ビルド時の500KB超え警告が解消されること
- vp checkが通る

## 背景

@emoji-mart/dataの絵文字データ（~500KB）が最大のJSチャンクとして初期バンドルに含まれている。
emoji pickerは常に表示されるわけではないため、dynamic importで遅延ロードにする。
