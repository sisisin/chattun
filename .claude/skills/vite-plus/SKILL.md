---
name: vite-plus
description: 'Vite+ (vp CLI) の統合ツールチェインに関するリファレンス。dev/build/lint/fmt/testコマンド、vite.config.ts設定、マイグレーション手順。'
user-invocable: false
---

# Vite+ リファレンス

Vite+ は VoidZero による統合 Web 開発ツールチェイン。単一の `vp` CLI で以下を統合する:

| 機能 | ツール | 旧ツール相当 |
|------|--------|-------------|
| Dev server | Vite | webpack-dev-server / CRA |
| Bundler | Rolldown | webpack / Rollup |
| Linter | Oxlint | ESLint |
| Formatter | Oxfmt | Prettier |
| Test runner | Vitest | Jest |
| Task runner | Vite Task | npm-run-all |
| Library build | tsdown | tsc / rollup |

## CLI コマンド

```sh
vp create              # 新規プロジェクト作成
vp migrate             # 既存プロジェクトの移行
vp install             # 依存インストール
vp dev                 # 開発サーバー起動
vp check               # fmt + lint + type-check を一括実行
vp lint                # Oxlint でリント
vp lint --fix          # 自動修正付きリント
vp lint --type-aware   # 型情報を使ったリント
vp fmt                 # Oxfmt でフォーマット
vp fmt --check         # フォーマットチェック（変更なし）
vp test                # テスト実行（単発、watchではない）
vp test watch          # ウォッチモード
vp test run --coverage # カバレッジ付きテスト
vp build               # プロダクションビルド
vp preview             # ビルド結果プレビュー
vp run <task>          # Vite Task 実行
vp env                 # Node.js バージョン管理
vp upgrade             # Vite+ 自体のアップグレード
```

## 設定ファイル: vite.config.ts

全ツール設定を `vite.config.ts` に集約する。個別設定ファイル（`.oxlintrc.json`, `vitest.config.ts`, `.oxfmtrc.json` 等）は使わない。

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Vite 設定（dev server, build）
  server: {
    port: 3000,
  },

  // Oxlint 設定
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,   // 型情報を使ったルール有効化
      typeCheck: true,    // 型チェックもlint時に実行
    },
  },

  // Oxfmt 設定
  fmt: {
    singleQuote: true,
  },

  // Vitest 設定
  test: {
    include: ['src/**/*.test.ts'],
  },

  // tsdown / library build 設定
  pack: {
    // ...
  },
});
```

## 既存プロジェクトの移行

```sh
vp migrate             # 対話的に移行
vp migrate --no-interactive  # 非対話的
```

`vp migrate` が行うこと:
- 依存パッケージの更新
- import文の書き換え（vitest → vite-plus/test 等）
- 個別設定ファイルを vite.config.ts に集約
- package.json scripts を vp コマンドに更新
- lint-staged を vite.config.ts の `staged` ブロックに移行

**前提条件**: Vite 8+ / Vitest 4.1+ へ事前アップグレード推奨。
**注意**: 多くのプロジェクトで `vp migrate` 後に手動調整が必要。

移行後の確認:
```sh
vp install
vp check
vp test
vp build
```

## パフォーマンス

- Oxlint: ESLint の 50-100x 高速
- Oxfmt: Prettier の 30x 高速
- Rolldown: Rollup の 1.6-7.7x 高速（ビルド）
- `vp check`: fmt + lint + type-check 同時実行で個別実行の 2x 高速

## ESLint からの移行メモ

- Oxlint は ESLint コアルールと主要コミュニティルールを内蔵
- ESLint プラグイン依存がある場合、Oxlint の JavaScript プラグインサポートで段階移行可能
- `no-restricted-imports` 相当のルールは Oxlint で対応可能

## Prettier からの移行メモ

- Oxfmt は Prettier 完全互換を目指した設計
- `singleQuote` 等の主要オプションはそのまま使える
- エディタ統合: formatter 設定で `./vite.config.ts` をパスに指定

## Jest からの移行メモ

- Vitest は Jest スタイルの expect, snapshot, coverage をサポート
- ESM, TypeScript, JSX をネイティブに処理
- Vite の設定・プラグインを共有するため追加設定が少ない
