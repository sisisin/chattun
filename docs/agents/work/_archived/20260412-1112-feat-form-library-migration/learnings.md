# Learnings: react-hook-form 移行

## 判断

- react-hook-form の利用箇所が2ファイルのみ、使用APIも `register` と `handleSubmit` だけだったため、tanstack form 等への移行ではなくライブラリ自体の削除（ネイティブ FormData API）で十分と判断
- FormData.get() は `FormDataEntryValue | null` を返すため、`as string` のアサーションではなく `typeof` チェックでガードするのが適切
