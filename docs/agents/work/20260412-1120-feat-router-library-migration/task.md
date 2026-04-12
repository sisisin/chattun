# Task: react-router-dom を TanStack Router に移行する

## 達成条件

- react-router-dom, history パッケージを削除し、@tanstack/react-router に移行
- 既存の4ルート (/, /setting, /thread/:channelId/:ts, /login) が正常に動作する
- 認証ガード (WithAuth) が動作する
- プログラマティックナビゲーション (appHistory.push) が動作する
- code splitting (loadable) が維持される
- 型チェック・lint・テストがパスする

## 背景

react-router-dom v5 + history v4 を使用中。TanStack Router はフルタイプセーフなルーティングを提供し、code-based routing でルート4本の小規模アプリに適合する。

## スコープ

- `AppRouteDefinitions.ts`: TanStack Router のルート定義に書き換え
- `Routes.tsx`: RouterProvider に書き換え
- `AppLink.tsx`: TanStack Router の Link に移行
- `useRouter.ts`: TanStack Router の hooks に移行
- `Menu.tsx`: TanStack Router の Link に移行
- `appHistory.ts`: router.navigate に移行
- `Tweet.tsx`: AppLink を TanStack Router Link に移行
- `thread/module.tsx`: useRouter を TanStack Router hooks に移行
- `session/module.ts`, `rtm-socket.ts`: appHistory.push を router.navigate に移行
- `package.json`: 依存関係の入れ替え
