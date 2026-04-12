# Task: serverのtypescript本番依存をなくす

## 背景

Node.js 22はネイティブでTypeScriptを実行できる（--experimental-strip-types、22.6+でフラグ不要のtype stripping）。
ts-nodeは古く、TypeScript 6.0との互換性問題（TS5011 rootDir必須）でCloud Runデプロイが失敗している。
ts-nodeとtypescriptを本番dependenciesから外し、Node.jsのネイティブTS実行に切り替える。

## 達成条件

1. ts-nodeをserver/dependenciesから削除
2. typescriptをserver/dependenciesから削除（ルートdevDependenciesにのみ残す）
3. Dockerfile CMDをNode.jsネイティブTS実行に変更
4. npm scripts（start, dev, dev:mock）を更新
5. `pnpm vp run -r ci`が通る
6. Dockerビルドが通り、コンテナが正常に起動する（PORT=8080でリッスン）
7. nodemon設定をNode.jsネイティブTS実行に対応

## スコープ

- server/package.json: ts-node, typescript をdependenciesから削除、scripts更新
- Dockerfile: CMD変更
- server/nodemon.json: 必要に応じて更新
