# Task: 既存のコンポーネントごとのスタイリングのcssを.module.cssとし、css modules化する

## 原文

- Task: 既存のコンポーネントごとのスタイリングのcssを.module.cssとし、css modules化する
  - main.cssで個別コンポーネント向けのCSSをimportしているのもなんとかする
  - css.modules.localsConventionという設定でcssのクラスをcamelize出来るようなのでこれを利用すると良さそう ref. https://ja.vite.dev/guide/features#css-modules

## 達成条件

- コンポーネント固有のCSSファイルが `.module.css` にリネームされ、CSS Modules として import されている
- main.css からコンポーネント固有のCSS import が除去されている（グローバルCSS `_*.css` のみ残る）
- vite.config.ts に `css.modules.localsConvention` 設定が追加されている（camelCase化）
- 各コンポーネントで `className` が CSS Modules のオブジェクトプロパティアクセスに変更されている
- ビルド・lint が通る

## スコープ

対象CSSファイル（コンポーネント固有のもの）:
1. `front/src/app/components/menu/Menu.css` → `Menu.module.css`
2. `front/src/app/features/setting/components/Setting.css` → `Setting.module.css`
3. `front/src/app/features/toast/Toast.css` → `Toast.module.css`
4. `front/src/app/features/login/components/Login.css` → `Login.module.css`
5. `front/src/app/components/PwaInstallBanner.css` → `PwaInstallBanner.module.css`
6. `front/src/app/features/timeline/components/TimelineView.css` → `TimelineView.module.css`
7. `front/src/app/features/timeline/components/tweet/components/Tweet.css` → `Tweet.module.css`

対象外（グローバルCSS、main.css に残す）:
- `_reboot.css`, `_colors.css`, `_font.css`, `_spacing.css`, `_border-radius.css`, `_shadow.css`, `_icon.css`, `_base.css`, `_form.css`

## 検証ステップ

- [ ] review
- [x] browser-verification
