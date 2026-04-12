# Task: postcss-custom-mediaとpostcss-nestingをネイティブCSSに置き換え、postcss.config.jsを削除する

## 達成条件

- postcss-custom-media構文（@custom-media）をネイティブCSS @mediaに置き換え
- postcss-nesting構文（& セレクタ）をネイティブCSS nestingに置き換え（ブラウザ互換性確認済み）
- postcss-custom-media, postcss-nestingパッケージを削除
- autoprefixerのみ残す場合はvite.config.tsのcss.postcss設定に移行し、postcss.config.jsを削除
- UIが壊れていないこと
