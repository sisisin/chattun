# Learnings

## babel-runtime と emoji-mart

- emoji-mart 2.11.2 は内部で `babel-runtime/core-js/*` を require しているが、自身の dependencies に宣言していない（パッケージのバグ）
- v3.0.x は `@babel/runtime` に移行（API互換性はおおむねあるが確認は必要）
- v5.x はフルリライト（Web Components化、React以外にも対応）でAPIが完全に異なる。移行にはPickerやEmojiコンポーネントの全面書き換えが必要
- 現時点では babel-runtime を明示的依存として維持するのが適切。emoji-mart v5移行は別タスクとして切り出す

## @types/webpack-env

- CRA→vite+移行完了により既に不要になり削除済みだった
