# Research: Menu定義とRoute定義の統合

## 現状

### router.tsx
4つのルートを定義:
- `/` — Timeline（authLayout配下）
- `/setting` — Setting（authLayout配下）
- `/thread/$channelId/$ts` — Thread（authLayout配下）
- `/login` — Login（rootRoute直下、認証不要）

### Menu.tsx
pathname手動判定で以下を制御:
- **タイトル表示**: `isSetting ? "設定" : "すべての投稿"`
- **戻るボタン**: `!isTimeline` のとき表示
- **設定アイコン**: `!isSetting` のとき表示

## 統合アプローチの検討

### アプローチ1: ルート定義にメタデータを持たせる

TanStack Routerの `staticData` を使い、各ルートにメニュー表示情報を付与する:

```typescript
const pageConfig = [
  { path: '/', title: 'すべての投稿', showSettingIcon: true, showBackButton: false },
  { path: '/setting', title: '設定', showSettingIcon: false, showBackButton: true },
  { path: '/thread/$channelId/$ts', title: 'すべての投稿', showSettingIcon: true, showBackButton: true },
] as const;
```

**メリット**: ルートとメニュー表示の対応が一箇所で見える
**デメリット**: 
- Menu.tsxのロジックはシンプルなif文で3画面しかないため、統合の恩恵が薄い
- TanStack Routerの `staticData` を使うとルート定義が冗長になる
- thread/loginはMenuの表示制御に関与しない（threadはtimelineと同じ、loginはMenuなし）

### アプローチ2: 共通定義配列からルートとメニューの両方を生成

```typescript
const pages = [
  { path: '/', component: TimelineModule, menuTitle: 'すべての投稿', ... },
  { path: '/setting', component: SettingModule, menuTitle: '設定', ... },
];
```

**メリット**: 完全に一箇所で管理
**デメリット**:
- TanStack Routerの型安全なルート定義（createRoute + routeTree）との相性が悪い
- ルートごとにparentRoute（authLayout vs rootRoute）が異なるため、一律にはできない
- コード量が増える割に画面数が少ない

## 結論

**researchとしてまとめる（実装しない）**

理由:
- 現状3画面 + loginの4ルートで、Menu.tsxのif分岐はシンプルかつ明確
- TanStack Routerの型安全なルート定義を維持したまま統合するには冗長なラッパーが必要
- 画面数が増えたとき（10+画面など）には恩恵があるが、現時点ではover-engineering
- Menu.tsxの分岐は直感的で読みやすく、変更頻度も低い
