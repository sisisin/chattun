# Learnings

## CSS Modules 移行パターン

- `camelCaseOnly` の `localsConvention` を使うと `.tweet-actions-list` → `styles.tweetActionsList` のように自然にアクセスできる
- BEM の複合セレクタ `.foo.is-bar` は CSS Modules と相性が悪いので `.foo-bar` のように単一クラスにリファクタリングする
- `[data-theme='dark'] .login-visual` のようなグローバル属性セレクタとの組み合わせは `:global([data-theme='dark']) .login-visual` で対応
- CSS Module の styles をコンポーネント外に export するのはカプセル化違反。レイアウト用クラスは使う側の module に定義する
- グローバル CSS（`_form.css` 等）のクラスはそのままグローバルとして使い、コンポーネント固有のもののみ module 化する
- `*.module.css` の TypeScript 型宣言（`css-modules.d.ts`）が必要（vite/client が types に入っていない場合）

## クロスコンポーネント CSS の整理

`mention-self` のように別 feature のコンポーネントから参照されていたスタイルは、使用するコンポーネント（MrkdwnRenderer）に co-locate した module に移動するのが正しい。Tweet.css → MrkdwnRenderer.module.css へ。
