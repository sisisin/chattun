# UIデザインガイド（実装リファレンス）

詳細なデザインシステム仕様は [docs/guide/ui-design.md](../../../docs/guide/ui-design.md) を参照。

以下は実装時に特に守るべきルールの要約。

## カラー

直接カラーコードを使わない。必ずセマンティックトークンを使うこと。

```css
/* NG */
color: hsl(323, 51%, 72%);
background: #fff;

/* OK */
color: var(--text-main);
background: var(--background-base);
```

### 主要セマンティックトークン

| 用途 | トークン |
|---|---|
| 強調テキスト | `--text-main`, `--text-main-alt` |
| 本文テキスト | `--text-base` |
| 補助テキスト | `--text-sub` |
| 反転テキスト（白） | `--text-revert` |
| 主要背景 | `--background-main` |
| ページ背景 | `--background-base` |
| 入力欄背景 | `--background-sub` |
| primary ボーダー | `--border-main` |
| 通常ボーダー | `--border-base` |
| 区切り線 | `--border-sub` |

## タイポグラフィ

```css
/* フォントサイズはトークンを使う */
font-size: var(--font-normal);    /* 1rem — 本文 */
font-size: var(--font-small);     /* 0.8rem */
font-size: var(--font-small-ex);  /* 0.6rem — タイムスタンプ等 */
font-size: var(--font-large);     /* 1.2rem */
font-size: var(--font-large-ex);  /* 1.5rem — 大見出し */
```

## スペーシング

基本単位は 4px / 8px。`_spacing.css` のトークンを使うこと。

```css
padding: var(--spacing-sm);   /* 8px */
margin: var(--spacing-md);    /* 16px */
gap: var(--spacing-xl);       /* 32px */
```

| トークン | 値 |
|---|---|
| `--spacing-xs` | 4px |
| `--spacing-sm` | 8px |
| `--spacing-md` | 16px |
| `--spacing-lg` | 24px |
| `--spacing-xl` | 32px |
| `--spacing-2xl` | 48px |
| `--spacing-3xl` | 64px |

## ボーダーラジウス

`_border-radius.css` のトークンを使うこと。

| トークン | 値 | 用途 |
|---|---|---|
| `--border-radius-sm` | 4px | ボタン、ラベル、リアクション |
| `--border-radius-md` | 5px | フォーム入力（input, select） |
| `--border-radius-lg` | 8px | コードブロック、画像 |

## ダークモード

`:root` にライトモード値がデフォルト定義、`@media (prefers-color-scheme: dark)` で上書き。
コンポーネントではセマンティックトークンを参照すれば自動で切り替わる。

## シャドウ

| トークン | 用途 |
|---|---|
| `--shadow-weakest` | 最も弱いシャドウ |
| `--shadow-weak` | 弱めのシャドウ |
| `--shadow-normal` | 標準（カードhover） |
| `--shadow-strong` | 強め（ヘッダー） |
| `--shadow-strongest` | 最も強いシャドウ |

## アイコン

SVGベースのカスタムアイコン（`front/src/app/components/icons/Icons.tsx`）。

- stroke ベース（fill: none）
- stroke-width: 4px
- stroke-linecap / linejoin: round
- 色は `--icon` トークンで自動切替
