# Task: scripts/,docker/をtools/へ統合する

## 達成条件

- scripts/ と docker/ を tools/ 配下に役割に沿った構成で移動
- スクリプト内の相対パス参照を修正
- CI workflow、CLAUDE.md、README.md の参照を更新
- vp checkが通る

## 構成

```
tools/
  deploy/   ← _lib.sh, build_image.sh, deploy.sh, build_and_deploy_image.sh
  setup/    ← setup_pem.sh, print_slack_manifest.sh
  docker/   ← docker-compose.yml, .gitignore
  bin/      ← 既存（変更なし）
  agents/   ← 既存（変更なし）
```

## 修正が必要なファイル

- tools/deploy/_lib.sh: `$script_dir/..` → `$script_dir/../..`
- tools/setup/setup_pem.sh: `$script_dir/..` → `$script_dir/../..`
- .github/workflows/push--build-and-deploy.yaml
- .github/workflows/call--deploy-service.yaml
- CLAUDE.md, README.md
