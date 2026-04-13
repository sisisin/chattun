# Learnings

## filterMutedUsersのジェネリック化

`filterMutedUsers` を `<T extends { displayName: string; fullName: string }>` としてジェネリックにしたことで、timeline/thread 両方の selector から再利用できるようになった。フィルタロジックをコンポーネントではなく selector に置くことで、コンポーネントが受け取る時点で既にフィルタ済みになり、不要な re-render を防げる。
