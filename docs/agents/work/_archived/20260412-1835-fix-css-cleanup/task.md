# Task: CSSの不要ファイル・レガシーコードを削除する

## 達成条件

- 空のCSS（Timeline.css, Thread.css, EmojiMenu.css）のインポートが削除されている
- _base.cssのCRAテンプレート由来の.Appスタイルが削除されている
- emoji-custom.cssの1行がTweet.cssにインライン化され、ファイルが削除されている

## 背景

CSS調査で発見された不要コードの削除。空ファイルやレガシーコードが残っており、保守性を下げている。
