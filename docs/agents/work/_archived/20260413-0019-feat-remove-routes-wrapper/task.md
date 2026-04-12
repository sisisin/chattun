# Task: Routes.tsx の不要なラッパーを削除

## 原文
front/src/app/components/Routes.tsx で一段コンポーネント挟む理由ないのでなくして

## 達成条件
- Routes.tsx を削除し、App.tsx で直接 RouterProvider を使用する

## スコープ
- `front/src/app/components/Routes.tsx` を削除
- `front/src/app/App.tsx` で `RouterProvider` を直接使用

## 検証ステップ

- [x] review
- [x] browser-verification
