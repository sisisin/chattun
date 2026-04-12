# Task: rxjs 6→7にアップグレードする

## 達成条件

- rxjs 6.5.4→7.xにアップグレードする
- 型エラーやランタイムエラーを解消する
- `tsc --noEmit`、`vp check`、`vp test run`が全てパスすること

## 背景

rxjs 7は型安全性の向上（ajaxのresponse型がunknownに）、toPromise()非推奨化、rxjs/internal-compatibilityの削除などの破壊的変更がある。typelessがrxjs 6のpeerDependencyを要求しているため、pnpm patchで互換性を確保する。
