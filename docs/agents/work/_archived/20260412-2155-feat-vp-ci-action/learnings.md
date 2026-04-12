# Learnings

## vp staged (vite-hooks) 実行時のPATH

vp stagedから実行されるpre-commitフックでは、miseのactivateが行われていないため、mise管理のツール（pinact等）がPATHに含まれない。
`mise x -- <command>` でラップすることで解決。

## setup-vp の node-version-file

`voidzero-dev/setup-vp` の `node-version-file` は `.nvmrc`, `.node-version`, `.tool-versions`, `package.json` のみ対応。`mise.toml` は非対応のため、grep等で手動抽出してnode-versionに渡す必要がある。
