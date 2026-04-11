# Task: frontのみyarnからpnpmへ移行 + CI修正

## 達成条件

- front/ のパッケージマネージャがyarn 1.xからpnpmに移行されていること
- GitHub Actionsの全ワークフローが成功すること
- Dockerfileのビルドが成功すること
- ローカル開発（yarn start相当）が動作すること

## 背景

`vp config`（prepareスクリプト）がpackage.jsonに`packageManager: "yarn@4.13.0"`を書き込む。
これによりcorepackがyarn 4を期待し、yarn 1.xの実行がブロックされてCIが失敗している。
pnpmに移行することで、packageManagerフィールドが正しく設定され、corepackとの互換性問題が解消される。

## スコープ

- front/yarn.lock → front/pnpm-lock.yaml
- front/package.json の engines.yarn 削除、scripts 更新
- .github/workflows の yarn → pnpm 変更
- Dockerfile の yarn → pnpm 変更
- CLAUDE.md 等のドキュメント更新
