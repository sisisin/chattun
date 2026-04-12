# Task: service workerのビルドをvpに含めてビルドコマンドをvpに統一

## 達成条件

- swSrc/sw.tsのビルドをViteプラグインとして統合し、`tsc -p ./swSrc`の個別実行を不要にする
- `build-sw`タスクを削除、`build-js`の`dependsOn`から除去
- `watch-sw`タスクを削除（dev時もViteプラグインで処理）
- `pnpm start`スクリプトを`vp dev`のみに簡素化
- ビルド成果物（public/sw.js）が従来通り生成されること

## 背景

現在swSrc/sw.tsは別途tscでコンパイルしてpublic/sw.jsに出力。これをViteのビルドパイプラインに統合し、コマンドを統一する。
