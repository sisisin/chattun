# Learnings: feat/remove-storybook

## 学び

### Storybook削除の際の見落としやすい箇所
- utility/storybook/ のようなヘルパー・モックデータディレクトリ
- CSS内のStorybook専用クラス
- ソースコード内のStorybook言及コメント
- eslintrc の stories ファイル用override設定
- yarn.lock の更新（package.json だけ変更しても lock は残る）
- reg-suit, storycap, story2sketch などのビジュアルテスト関連ツール
- regconfig.json などの設定ファイル
