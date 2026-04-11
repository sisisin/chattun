# Learnings: vp runタスクランナー移行

## vp runは単一パッケージでも使える

vp runはモノレポ向けだけでなく、単一パッケージ内でもvite.config.tsのrun.tasksにタスク定義してdependsOnで依存関係を表現し、自動的に並列実行できる。`--parallel`フラグで依存関係を無視した並列実行も可能。

## package.jsonのscriptsとvite.config.tsのtasksの使い分け

- vite.config.tsのrun.tasks: ビルドパイプラインなど依存関係のあるタスク、キャッシュが効くタスク
- package.jsonのscripts: 単純なコマンドエイリアス、vp自体を呼ぶもの（lint, fmt等）
