# Learnings

## pnpm workspace での依存ホイスト

- ルートの devDependencies はワークスペース全体で利用可能。サブパッケージから明示的に参照せずとも解決される
- vite/vite-plus のような CLI ツールもルートに置けば `cd front && pnpm vp ...` で正常に動作する
- server の TypeScript を 5.8.3 → 6.0.2 に上げても `module: "commonjs"` 構成で問題なく型チェックが通る

## @types/node のバージョン注意

- front は src コードで Node.js API を使っていないため @types/node は不要（vite.config.ts 用は vite の型定義でカバー）
- ルートに置いた @types/node@22 で vite の peer dependency 警告が解消された
