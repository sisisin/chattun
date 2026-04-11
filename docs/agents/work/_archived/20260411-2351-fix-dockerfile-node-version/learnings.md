# Learnings: Dockerfile Nodeバージョン更新

## mise.toml/package.json変更時のDockerfile同期

ローカル開発環境のNodeバージョンを上げた場合、Dockerfileのベースイメージも合わせて更新する必要がある。package.jsonのenginesとDockerfile、mise.tomlの3箇所が一致していることを確認すべき。server側のpackage.jsonも忘れずに。
