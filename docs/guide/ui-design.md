# UI Design Guide

chattunのUIデザイン仕様。新しいUIを実装する際はこのガイドに従うこと。

## カラーパレット

### Primary（ピンク / マゼンタ系）

| トークン | 値 | 用途 |
|---|---|---|
| `--light-main` | hsl(323, 51%, 72%) | ライトモード primary |
| `--light-main-alt` | hsl(323, 51%, 62%) | ライトモード primary alt |
| `--dark-main` | hsl(323, 51%, 52%) | ダークモード primary |
| `--dark-main-alt` | hsl(323, 51%, 72%) | ダークモード primary alt |

### Secondary（シアン系）

| トークン | 値 | 用途 |
|---|---|---|
| `--light-sub` | hsl(197, 100%, 45%) | ラベル背景（ライト） |
| `--dark-sub` | hsl(197, 100%, 12%) | ラベル背景（ダーク） |

### アクセント

| トークン | 値 | 用途 |
|---|---|---|
| `--reacted` | hsl(240, 84%, 63%) | リアクション済み状態 |

### グレースケール

`--grayscale00`（黒 hsl(0,0%,0%)）から `--grayscale10`（白 hsl(0,0%,100%)）まで11段階。テキスト・背景・ボーダーの明暗調整に使用。

## セマンティックトークン

直接カラーコードを使わず、セマンティックトークンを使うこと。ダーク/ライトモードで自動的に切り替わる。

> 以下の表のライト/ダークモード列の値はCSSカスタムプロパティ名（`--` 付き）を省略して記載している。実際のCSSでは `var(--light-main)` のように参照する。

### テキスト

| トークン | ライトモード | ダークモード | 用途 |
|---|---|---|---|
| `--text-main` | light-main | dark-main | 強調テキスト |
| `--text-main-alt` | light-main-alt | dark-main-alt | 強調テキスト（alt） |
| `--text-base` | grayscale00 | grayscale09 | 本文テキスト |
| `--text-sub` | grayscale05 | grayscale06 | 補助テキスト（タイムスタンプ等） |
| `--text-revert` | grayscale10 | grayscale10 | 反転テキスト（常に白） |

### 背景

| トークン | ライトモード | ダークモード | 用途 |
|---|---|---|---|
| `--background-main` | light-main | dark-main | ヘッダー等の主要背景 |
| `--background-base` | grayscale10 | grayscale02 | ページ背景 |
| `--background-sub` | grayscale09 | grayscale04 | コードブロック、入力欄背景 |

### ボーダー

| トークン | ライトモード | ダークモード | 用途 |
|---|---|---|---|
| `--border-main` | light-main | dark-main | primary ボーダー |
| `--border-base` | grayscale07 | grayscale05 | 通常ボーダー |
| `--border-sub` | grayscale09 | grayscale06 | 薄いボーダー（区切り線） |

### シャドウ

| トークン | 値 | 用途 |
|---|---|---|
| `--shadow-weakest` | 0 1px 2px | 最も弱いシャドウ |
| `--shadow-weak` | 0 1px 2px | 弱めのシャドウ |
| `--shadow-normal` | 0 1px 2px | 標準シャドウ（カードhover） |
| `--shadow-strong` | 0 2px 4px | 強めのシャドウ（ヘッダー） |
| `--shadow-strongest` | 0 2px 4px | 最も強いシャドウ |

各シャドウの色は `--shadow-color-*` でダーク/ライトモードごとに定義される。

## タイポグラフィ

### フォント

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
  'Helvetica Neue', sans-serif;
```

コード用: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`

### フォントサイズ

| トークン | 値 | 用途 |
|---|---|---|
| `--font-small-ex` | 0.6rem | タイムスタンプ、チャンネル名ラベル |
| `--font-small` | 0.8rem | 小さめのUI要素 |
| `--font-normal` | 1rem | 本文 |
| `--font-large` | 1.2rem | 見出し的な要素 |
| `--font-large-ex` | 1.5rem | 大見出し |

### フォントウェイト

- 400: 通常テキスト
- 700 (bold): 表示名、チャンネル名、見出し

## スペーシング

基本単位は 4px / 8px。CSSでは `_spacing.css` に定義されたトークンを使うこと。

| トークン | 値 | 用途 |
|---|---|---|
| `--spacing-xs` | 4px | 小さな内部余白、インラインコード padding |
| `--spacing-sm` | 8px | 標準 padding（ツイート、フォーム入力） |
| `--spacing-md` | 16px | セクション間 margin |
| `--spacing-lg` | 24px | リスト padding-left |
| `--spacing-xl` | 32px | 大きなセクション間の gap（設定画面） |
| `--spacing-2xl` | 48px | ヘッダー高さ、メニューアイコン幅 |
| `--spacing-3xl` | 64px | メニューグリッドカラム幅 |

## ボーダーラジウス

CSSでは `_border-radius.css` に定義されたトークンを使うこと。

| トークン | 値 | 用途 |
|---|---|---|
| `--border-radius-sm` | 4px | ボタン、ラベル、リアクション、インラインコード |
| `--border-radius-md` | 5px | フォーム入力（input, select） |
| `--border-radius-lg` | 8px | コードブロック（pre）、画像 |

## コンポーネントサイズ

インタラクティブ要素はタッチターゲットとして十分なサイズを確保すること。

### 最小サイズ

| 要素 | 最小サイズ | 備考 |
|---|---|---|
| タッチターゲット全般 | 36px × 36px | ボタン・アイコンなどクリック/タップ可能な要素 |
| テキスト入力 (input, select) | 高さ 36px 程度 | padding: 8px + font-size: 1rem で自然に確保される |

### ボタンバリエーション

| クラス | サイズ | padding | font-size | 用途 |
|---|---|---|---|---|
| `.button-primary` | 自動（padding 依存） | `--spacing-sm` `--spacing-md` (8px 16px) | 継承（1rem） | 保存・送信などの主要アクション |
| `.button-remove` | 36px × 36px 固定 | 0 | `--font-normal` (1rem) | 行削除（✕ボタン） |
| `.button-add` | 自動（padding 依存） | `--spacing-sm` `--spacing-md` (8px 16px) | `--font-small` (0.8rem) | 条件追加（+ ボタン） |

### フォーム行の高さ揃え

設定画面など、input / select / button が横並びになるフォーム行では:

- `align-items: center` でグリッド行内を中央揃えする
- input と select は同じ padding (`--spacing-sm`: 8px) を使い、高さを自然に揃える
- 隣接ボタン（remove 等）は input/select と同程度の高さ（36px）に合わせる
- アクションボタン群は `display: flex; gap: --spacing-xs; align-items: center` でまとめる

## コンポーネント

### ヘッダー（Menu）

- 固定配置（position: fixed, top: 0, z-index: 2）
- 高さ: 48px
- 背景: `--background-main`（primary color）
- テキスト: `--text-revert`（白）
- シャドウ: `--shadow-strong`
- 3カラムグリッド: 64px / 1fr / 64px

### ツイート（メッセージ）

- グリッドレイアウト: 48px（アバター） / 1fr / 144px（チャンネルラベル）
- padding: 8px
- hover: `--shadow-normal`
- 区切り: border-bottom 1px solid `--border-sub`
- チャンネルラベル: `--label-base` 背景、`--text-revert` テキスト、角丸4px

### ボタン

- `.button-primary`: `--button-primary` 背景、`--text-revert` テキスト、角丸4px、padding 8px 16px
- `.button-remove`: 36px角、`--border-main` ボーダー、`--text-sub` テキスト（✕）、font-size 1rem
- `.button-add`: 破線ボーダー（`--border-main`）、`--text-base` テキスト、font-size 0.8rem、padding 8px 16px
- アクションボタン（リアクション等）: 34px角、`--border-sub` ボーダー、hover で `--border-base`

### フォーム

- input / select: padding 8px、`--border-main` ボーダー、角丸5px
- checkbox: 24px角（ダークモード28px）、カスタムSVGチェックマーク

## アイコン

SVGベースのカスタムアイコン（`front/src/app/components/icons/Icons.tsx`）。

- stroke ベース（fill: none）
- stroke 色: `--icon`（ダーク/ライトモードで自動切替）
- stroke-width: 4px
- stroke-linecap / linejoin: round

## ダークモード

現在の実装では、`:root` にライトモード用の値がデフォルトとして定義されており、`@media (prefers-color-scheme: dark)` メディアクエリ内でダークモード用の値に上書きする構造になっている。（ライトモード用の `prefers-color-scheme: light` メディアクエリはコメントアウトされている。）

セマンティックトークンが自動的に再マッピングされるため、コンポーネントでは直接カラーコードを使わずトークンを参照すること。

## レスポンシブ

| ブレークポイント | 用途 |
|---|---|
| 480px | モバイルテキスト調整 |
| 960px | 2カラムレイアウト切替（ログイン画面） |

基本はモバイルファースト。コンテンツ幅はmax-width 96%（モバイル）。
