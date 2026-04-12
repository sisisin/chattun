# Task: React 16→18にアップグレードする

## 達成条件

- react, react-domを18系にアップグレード
- ReactDOM.render→createRoot移行
- unmountComponentAtNode→root.unmount()移行
- @types/react, @types/react-domの更新
- typelessやreact-hook-form等の互換性確認・対応
- ビルド・テスト・UIが正常に動作すること

## 背景

React 16.13.0は2020年リリースの古いバージョン。React 18はconcurrent features、automatic batching、新hooks等を提供する。
