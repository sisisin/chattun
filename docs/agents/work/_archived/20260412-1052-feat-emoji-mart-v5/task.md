# Task: emoji-mart 2→5にアップグレードする

## 達成条件

- emoji-mart 2.11.2を5.xにアップグレードする
- `@emoji-mart/data`と`@emoji-mart/react`を追加する
- Picker/Emojiコンポーネントをv5 APIに移行する
- カスタム絵文字（Slack絵文字）がPickerで使えること
- リアクション表示が正しく動作すること
- babel-runtime依存を解消する
- `@types/emoji-mart`を削除する

## 背景

v5はフルリライト（Web Components化）でAPI非互換。Picker/Emoji/CustomEmojiの全面書き換えが必要。babel-runtime依存も解消できる。
