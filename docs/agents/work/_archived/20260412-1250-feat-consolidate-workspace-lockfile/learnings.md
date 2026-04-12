# Learnings

## pnpm workspace lockfile 統合時の注意点

- `shared-workspace-lockfile=false` を外すと、各ワークスペースの個別 lockfile は無視され、ルートに単一 lockfile が生成される
- 個別 lockfile を削除してから `pnpm install` でルート lockfile を生成する手順で移行できる
- `pnpm.overrides` や `pnpm.patchedDependencies` はワークスペースルートの package.json でのみ有効。サブパッケージに書いても無視される
- `patchedDependencies` のパスはルートからの相対パスに変更が必要（例: `patches/foo.patch` → `front/patches/foo.patch`）

## 暗黙の依存が顕在化する

- `shared-workspace-lockfile=false` 環境ではサブパッケージごとに独立した node_modules が構築されるため、暗黙的にホイストされた依存に気づきにくい
- 統合すると依存解決が変わり、明示的に宣言されていないパッケージ（例: server の `@types/node`）が解決できなくなる
- 統合時に各パッケージの `tsc --noEmit` やテストを通して暗黙の依存を洗い出す必要がある

## CI ワークフローも lockfile パスに依存している

- `actions/setup-node` の `cache-dependency-path` が個別 lockfile を参照していた
- `pnpm install --frozen-lockfile` の実行ディレクトリもルートに変更が必要
- Dockerfile も同様にルート lockfile 前提の構成に変更が必要

## Dockerfile の `--filter` install 挙動

- `pnpm install --frozen-lockfile --filter <pkg>` はフィルタ対象パッケージの `node_modules` にのみインストールする
- ルートに `patchedDependencies` があると、パッチファイルの存在チェックが走るため、フィルタ対象外のパッケージのパッチファイルも Docker コンテキストに含める必要がある
