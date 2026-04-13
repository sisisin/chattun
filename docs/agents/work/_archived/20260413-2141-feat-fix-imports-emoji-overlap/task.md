# Task: front/src/app/imports.ts と EmojiMenuViewの処理が被ってるように見える。整理して適切な処理に直す

## 原文

- Task: front/src/app/imports.ts と EmojiMenuViewの処理が被ってるように見える。どういう理屈なのか整理して、適切な処理に直して

## 調査結果

### imports.ts の処理

```ts
import('@emoji-mart/data').then(({ default: data }) => {
  import('emoji-mart').then(({ init }) => {
    init({ data });
  });
});
```

アプリ起動時（`index.tsx` で `import './app/imports'`）に `@emoji-mart/data` と `emoji-mart` を動的インポートし、`init({ data })` でグローバルにデータを事前ロードする。

### EmojiMenuView.tsx の LazyPicker

```ts
const LazyPicker = React.lazy(async () => {
  const [{ default: Picker }, { default: data }] = await Promise.all([
    import('@emoji-mart/react'),
    import('@emoji-mart/data'),
  ]);
  return {
    default: (props) => <Picker data={data} {...props} autoFocus />,
  };
});
```

Picker コンポーネントの lazy ロード時に `@emoji-mart/data` を再度インポートし、`data` prop として Picker に渡す。

### 重複の理由

emoji-mart は2つの初期化方法を提供する:
1. `init({ data })` — グローバルにデータを事前ロード（Picker は data prop なしで使える）
2. `Picker` の `data` prop — Picker に直接データを渡す

現状は**両方やっている**ため冗長。`@emoji-mart/data`（約1.5MB gzip前）が2箇所でインポートされている（バンドラのチャンク共有により実データの重複はないが、初期化パスが重複）。

### 方針

- `imports.ts` はそのまま残す（アプリ起動時にデータを事前ロードする役割）
- `EmojiMenuView.tsx` の `LazyPicker` から `@emoji-mart/data` の重複インポートと `data` prop を除去する
- `init({ data })` で事前ロード済みなので、Picker に `data` を渡す必要がない

## 達成条件

- EmojiMenuView の LazyPicker から `@emoji-mart/data` インポートと `data` prop を除去
- imports.ts の事前ロードはそのまま維持
- lint / type-check が通る
- 絵文字ピッカーが正常に動作する（ブラウザ確認）

## 検証ステップ

- [x] review
- [x] browser-verification
