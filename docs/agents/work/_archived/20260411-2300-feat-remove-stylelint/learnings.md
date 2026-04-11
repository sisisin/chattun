# Learnings: feat/remove-stylelint

## 学び

### stylelint削除で見落としやすい箇所
- postcss.config.jsにstylelintがプラグインとして埋め込まれていることがある（postcss-importのpluginsオプション）
- lint-staged.config.jsでCSSファイルに対するstylelintコマンドの参照
- package.jsonのlint-staged設定にCSS用のstylelint-fixエントリがある場合、lint-staged.config.jsとは別に存在する
