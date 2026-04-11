# Task: create-react-appをvite+へ移行する

## 達成条件

1. CRA (react-scripts + craco) の代わりにvite+でフロントエンドのdev server / 本番ビルドが動作する
2. 画面が正常に表示できることを確認する（モックモードで確認可能）
3. create-react-app関連の依存（react-scripts, @craco/craco, @babel/core, babel-loader等）が削除されている
4. 既存のテスト、lint、formatが引き続き動作する

## 背景

現在フロントエンドはCRA + cracoでビルドしているが、vite+への統一を進めている。
lint, format, test, task runnerは既にvite+に移行済み。dev serverとbundlerがCRA依存の最後の部分。

## スコープ

- front/vite.config.ts のdev/build設定
- front/package.json の依存整理
- front/craco.config.js の削除
- front/public/index.html → index.html（viteはルートにindex.htmlを配置）
- 環境変数のREACT_APP_* → VITE_*への移行
- CRA固有のランタイム（react-scripts/config/webpack等）の排除

## 注意事項

- Taskが大きすぎる場合は分解してそれぞれTaskとして追加する
