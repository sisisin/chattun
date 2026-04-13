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

## CSS Modules

コンポーネント固有のスタイルは **CSS Modules** (`.module.css`) を使う。

### 基本ルール

- コンポーネント固有の CSS ファイルは `.module.css` で作成し、コンポーネントと同じディレクトリに配置する
- `import styles from './Foo.module.css'` で import し、`className={styles.fooBar}` でアクセスする
- vite.config.ts に `css.modules.localsConvention: 'camelCaseOnly'` が設定されているため、CSS 側の `.foo-bar` は JS 側で `styles.fooBar` としてアクセスする
- グローバル CSS（`front/src/app/css/_*.css`）には CSS Modules を使わない。`_form.css` 等のユーティリティクラスはそのままグローバルとして利用する

### アンチパターン

- CSS Module の `styles` オブジェクトを他コンポーネントに export しない（カプセル化違反）。レイアウト用のクラスは使う側の module に定義する
- `main.css` にコンポーネント固有の CSS を `@import` しない
- BEM の複合セレクタ `.foo.is-bar` は CSS Modules と相性が悪い。`.foo-bar` のように単一クラスにする
- `[data-theme='dark']` 等のグローバル属性セレクタとの組み合わせには `:global()` を使う: `:global([data-theme='dark']) .local-class`

## feature モジュールパターン

各機能は `features/<name>/` に以下の構成で実装する（`.blueprints/feature` テンプレート参照）:

### ファイル構成

- `interface.ts` — `createModule()` で Actions・State・getter を定義
- `symbol.ts` — typeless の Symbol 定義
- `module.tsx` — Epic (副作用) + Reducer + **Module コンポーネント**
- `components/` — View コンポーネント（`<Name>View.tsx`）、CSS、サブコンポーネント

### module.tsx のパターン

module.tsx は typeless の `handle()` を呼び出し、対応する View コンポーネントをレンダリングする **Module コンポーネント** を export する:

```tsx
// --- Epic ---
handle.epic().on(XxxActions.someAction, ...);

// --- Reducer --- (State が不要な feature では省略可)
export const reducer = handle.reducer(initialState);

// --- Module ---
export const Xxx = (props) => {
  handle();
  return <XxxView {...props} />;
};
```

**重要**: `handle()` は Module コンポーネント内で呼ぶ。View や親コンポーネントから `useSomeModule()` のようなフックで呼び出すのは誤り。

### ネスト feature

feature はネストしてよい（例: `timeline/components/tweet/`）。ネストされた feature も同じパターン（interface.ts + symbol.ts + module.tsx + components/）に従う。
