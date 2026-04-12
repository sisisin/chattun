# Task: TypeScriptを最新にする

## 達成条件

- TypeScriptを3.8.3から最新安定版にアップグレードする
- `pnpm vp run build-js` が成功すること
- `pnpm vp run test-all` が成功すること
- tsconfig.jsonの非推奨/削除オプションを更新すること

## 背景

TypeScript 3.8.3は2020年リリースで大幅に古い。最新は6.0.2。
tsconfig.jsonに `suppressImplicitAnyIndexErrors`（TS5で削除）など非推奨オプションがある。

## スコープ

- TypeScriptパッケージのアップグレード
- tsconfig.json（メイン + swSrc）の非推奨オプション更新
- 型エラーの修正
- @types/*パッケージの互換性確認・更新
