# CSS リファクタリング調査結果

## 調査概要

front/src/app/css/ 配下の共通CSS、および各コンポーネントCSSをdocs/guide/ui-design.mdと照合した。

## 重要な発見

### クリティカル: シャドウ定義のシンタックスバグ

`_shadow.css` の5-6行目で `--shadow-strong` と `--shadow-strongest` がカンマ区切りになっている。
CSS box-shadow はスペース区切りが正しく、現状これらのシャドウは正しく適用されない。

```css
/* 現状（壊れている） */
--shadow-strong: 0, 2px, 4px var(--shadow-color-strong);
/* 正しい */
--shadow-strong: 0 2px 4px var(--shadow-color-strong);
```

### デザインガイドとの乖離

1. **フォームのborder-radius**: _form.cssで5px使用。デザインガイドでは5pxと記載あるが、他の要素は4px統一
2. **チェックボックスサイズ**: ライト24px / ダーク28pxで不整合
3. **非標準スペーシング**: 1px, 6px, 18px, 92px等、4px/8pxグリッドに沿わない値が散在
4. **ハードコードフォントサイズ**: Login.cssの2remがトークン未使用

### 構造的な問題

1. **空CSSファイル**: Timeline.css, Thread.css, EmojiMenu.css がほぼ空でインポートされている
2. **レガシーコード**: _base.cssに CRA テンプレートの .App スタイルが残存
3. **トークン不足**: スペーシング・ボーダーラジウスのトークンが未定義で、ハードコード値が散在
4. **重複スタイル**: Tweet.cssのアクションボタン系スタイルが重複

## Task化の判断

- シャドウバグ修正: 即座に修正すべき（Task化）
- 空ファイル・レガシーコード削除: 低リスクで効果大（Task化）
- トークン追加・適用: デザインガイド整合性向上（Task化）
- 重複スタイル統合: 中程度の効果、将来のUI変更時に対応でも可
