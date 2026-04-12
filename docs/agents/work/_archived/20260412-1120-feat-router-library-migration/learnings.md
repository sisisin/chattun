# Learnings: TanStack Router 移行

## TanStack Router の useParams 型

- `useParams({ strict: false })` は StructuralSharingOption の制約を満たさない場合がある。`structuralSharing: false` を明示的に渡す必要がある
- interface はインデックスシグネチャを暗黙に持たないため、`Record<string, string>` 制約に合わない。`{ [K in keyof T]: string }` 形式にすることで具体的な interface も受け入れ可能

## 移行時の副産物

- @loadable/component は TanStack Router の lazyRouteComponent で代替できたため削除
- AppRouteDefinitions.ts の型システム（AppPaths, GetOptionFromPath 等）は TanStack Router のルート型安全性で不要に
- appHistory の型付きナビゲーション（パスリテラル型安全性）は簡略化。TanStack Router の型安全 navigate でカバー可能だが、現在の appHistory.push は string 型のみ
