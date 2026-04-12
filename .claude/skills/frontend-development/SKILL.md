---
name: frontend-development
description: 'フロントエンド（front/src/）の実装時に参照する開発ガイド。UIデザイン・CSS規約・コンポーネント構造。'
user-invocable: false
---

# フロントエンド開発ガイド

front/src/ 配下のファイルを変更する際に従うべきガイドライン。

## UIデザイン

UI に関わる変更（CSS、コンポーネントのスタイリング、新規UI要素の追加）を行う場合は、必ず [design.md](design.md) を読んでから実装すること。

design.md には以下が定義されている:
- カラーパレットとセマンティックトークン
- タイポグラフィ（フォント、サイズ、ウェイト）
- スペーシングとボーダーラジウス
- コンポーネントパターン（ヘッダー、ツイート、ボタン、フォーム）
- ダークモード対応ルール

### 必須ルール

- 直接カラーコードを使わず、セマンティックトークン（`var(--text-main)` 等）を使うこと
- フォントサイズは定義済みトークン（`var(--font-normal)` 等）を使うこと
- スペーシングは 4px / 8px の基本単位に揃えること
- 新規コンポーネントは既存のコンポーネントパターンに合わせること

## feature モジュールパターン

各機能は `features/<name>/` に以下の構成で実装する:
- `interface.ts` — Action 定義、State 型、Symbol
- `module.ts(x)` — Epic (副作用) + Reducer + Module フック
- `components/` — React コンポーネント
- `symbol.ts` — typeless の Symbol 定義
