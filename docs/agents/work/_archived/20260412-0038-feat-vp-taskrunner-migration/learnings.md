# Learnings

## vp runの並列実行はCLIフラグのみ

- `vp run --parallel task1 task2`はCLIでのみ可能、config内で並列タスクグループは定義できない
- `dependsOn`は逐次実行のみ（`string[]`で並列オプションなし）
- watch系プロセスの並列起動はnpm scriptsに残す必要がある

## CIやDockerfileのコマンド更新を忘れない

- npm scriptsを削除する際、CI workflow（.github/workflows/）とDockerfileでyarn scriptを参照している箇所も更新が必要
- `yarn vp run <task>`形式にすることでnode_modules/.binが解決される

## vpのコマンド体系

- ビルトインサブコマンド: `vp lint`, `vp fmt`, `vp test`, `vp check`等 — run.tasks定義不要
- run.tasks定義: compound commands（複数vpコマンドの連結等）やシェルコマンドの定義に利用
- ドキュメントではこの2種類を明確に区別して記載すると分かりやすい
