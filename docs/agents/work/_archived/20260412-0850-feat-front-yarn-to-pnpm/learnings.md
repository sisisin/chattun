# Learnings: front yarn → pnpm 移行

## 学び

- `pnpm import` で yarn.lock から pnpm-lock.yaml に変換可能
- yarn の `resolutions` は pnpm では `pnpm.overrides` に変更が必要
- `corepack enable pnpm` を CI/Dockerfile で事前に実行する必要がある
- `actions/setup-node` の `cache: 'pnpm'` を使う場合、`corepack enable pnpm` を setup-node より前に実行しないとキャッシュが効かない
- vp config が packageManager フィールドを書き込む問題は、pnpm移行により根本解決された

## 仕組みとして解決できそうなこと

特になし
