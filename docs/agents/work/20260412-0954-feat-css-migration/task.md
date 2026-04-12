# Task: CSSをvite+で利用できる技術に移行し、postcssを消す

## 達成条件

- postcss-cliを削除し、CSSビルドをViteのパイプラインに統合する
- 不要なPostCSSプラグインを削除する
- watch-css/build-cssタスクを削除する
- `pnpm vp run build-js` と `pnpm vp run test-all` が成功すること
- 画面表示が変わらないこと

## 背景

現在CSSはpostcss-cliで別プロセスとしてビルドし、public/index.cssに出力してindex.htmlから直接読み込んでいる。
ViteはPostCSSを標準サポートしているため、CSSをJSからimportすればViteパイプラインに統合できる。

## スコープ

- main.cssをJS（index.tsx）からimportしViteパイプラインに統合
- postcss-import, cssnanoを削除（Viteが標準で処理）
- postcss-custom-propertiesを削除（モダンブラウザはネイティブ対応）
- postcss-custom-media, postcss-nesting, autoprefixerは残す（ブラウザ互換性のため）
- postcss-cli, watch-css, build-cssタスクを削除
- index.htmlからindex.cssのlink削除
- public/index.cssを削除
