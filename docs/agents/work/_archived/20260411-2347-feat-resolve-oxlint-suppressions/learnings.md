# Learnings: oxlint suppress解消

## typeless useActions の参照安定性

typeless の `useActions` は内部で `useMemo` を使っているが、依存配列に毎レンダーで新規生成される配列を渡しているため、返り値の参照が安定しない。`useEffect` の依存配列に含める場合は `useRef` パターンで安定化する必要がある。
