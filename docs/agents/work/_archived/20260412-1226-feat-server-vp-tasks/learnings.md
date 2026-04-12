# Learnings

## vp staged のルート実行とファイルパスの問題

- `vp staged` はステージされたファイルの絶対パスを staged コマンドに渡す
- ルートから実行して `vp check --fix` を front コンテキストで実行すると、ルート直下のファイルパスが front の lint に渡されてパニックする
- `staged` 設定の glob を `'front/**'` に限定することで、front のファイルのみがコマンドに渡される

## Dockerfile と prepare スクリプト

- ルートに `prepare: "vp config"` を追加すると、Docker の `pnpm install` でも実行される
- Docker 環境では git hooks 設定は不要なので `--ignore-scripts` を builder/runner 両方に追加が必要
- `--prod` だけでは prepare はスキップされない

## vp run -r ci の動作

- lockfile 統合後、ルートから `vp run -r ci` で全ワークスペースのCIが一括実行できるようになった
- 各パッケージの npm `ci` script を呼び出す形なので、server に vite-plus がなくても動作する
