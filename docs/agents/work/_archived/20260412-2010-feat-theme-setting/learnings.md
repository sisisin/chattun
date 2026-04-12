# Learnings

## typelessのepicハンドラは必ずAction/null/配列を返す

typelessのepicの`.on()`ハンドラが何も返さない（undefinedになる）と、rxjsのストリームで `TypeError: You provided 'undefined' where a stream was expected` エラーが発生する。副作用のみ実行してアクションをdispatchしない場合は `return null` を使う。

## prefers-color-schemeからdata-theme属性への移行

`@media (prefers-color-scheme: dark)` をJS制御のテーマ切り替えに置き換えるには:
1. CSSを `[data-theme='dark']` セレクタに変更
2. CSS nestingで子セレクタを書ける（`[data-theme='dark'] { select { ... } }`）
3. JS側で `document.documentElement.setAttribute('data-theme', ...)` を設定
4. `system` モードでは `matchMedia('(prefers-color-scheme: dark)')` にevent listenerを登録して動的追従
