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

5段階（weakest → strongest）。カードhoverには `--shadow-normal` を使用。

## タイポグラフィ

### フォント

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

コード用: `SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`

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

基本単位は 4px / 8px。

| 値 | 用途 |
|---|---|
| 4px | 小さな内部余白、インラインコード padding |
| 8px | 標準 padding（ツイート、フォーム入力） |
| 16px | セクション間 margin |
| 32px | 大きなセクション間の gap（設定画面） |
| 48px | ヘッダー高さ、メニューアイコン幅 |

## ボーダーラジウス

| 値 | 用途 |
|---|---|
| 4px | ボタン、ラベル、リアクション、インラインコード |
| 5px | フォーム入力（input, select） |
| 8px | コードブロック（pre）、画像 |

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

- `.button-primary`: `--button-primary` 背景、`--text-revert` テキスト、角丸4px
- アクションボタン（リアクション等）: 34px角、`--border-sub` ボーダー、hover で `--border-base`

### フォーム

- input / select: padding 8px、`--border-main` ボーダー、角丸5px
- checkbox: 24px角（ダークモード28px）、カスタムSVGチェックマーク

## アイコン

SVGベースのカスタムアイコン（`app/components/icons/Icons.tsx`）。

- stroke ベース（fill: none）
- stroke 色: `--icon`（ダーク/ライトモードで自動切替）
- stroke-width: 4px
- stroke-linecap / linejoin: round

## ダークモード

`prefers-color-scheme: dark` メディアクエリで自動切替。セマンティックトークンが自動的に再マッピングされるため、コンポーネントでは直接カラーコードを使わずトークンを参照すること。

## レスポンシブ

| ブレークポイント | 用途 |
|---|---|
| 480px | モバイルテキスト調整 |
| 960px | 2カラムレイアウト切替（ログイン画面） |

基本はモバイルファースト。コンテンツ幅はmax-width 96%（モバイル）。
