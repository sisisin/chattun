# Learnings: feat/replace-eslint-with-oxlint

## 学び

### eslint→oxlint移行のポイント
- vite-plusパッケージをインストールすれば、vp lintだけ単独で使える（ビルド全体をvite+にする必要なし）
- vite.config.tsを使うにはNode.js 22.18.0+が必要（--experimental-strip-types要件）
- eslintrc.jsのルールはoxlintで概ね再現可能。ルール名のprefixが異なる（@typescript-eslint→typescript, react-hooks→react）
- eslint-disableコメントはoxlint-disableに置換が必要
- no-unused-varsは_prefix renamedで解消するのが最もクリーン
- jsx-keyはスプレッドでkeyを渡すパターンを検出できない（誤検出）ので、明示的にkey propを渡す形に修正するのがベスト
- CRA内蔵eslintはcraco.config.jsで`eslint: { enable: false }`で無効化

### lint移行時の注意
- lintがpassしない状態でレビューに進まない
- suppressが必要な場合はコメントで理由を明記し、修正タスクをTODO.mdに追加する
