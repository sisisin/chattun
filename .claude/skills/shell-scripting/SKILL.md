---
name: shell-scripting
description: シェルスクリプト開発の標準とベストプラクティス。ヘッダー、エラー処理、オプション解析、共通パターン。シェルスクリプトの計画・実装時に使用。
---

# シェルスクリプト開発ガイド

このプロジェクトで使用するシェルスクリプトの開発標準とベストプラクティス。

## 概要

シェルスクリプトの用途:

- ローカル開発の自動化
- CI/CD ワークフロー
- 環境セットアップ・設定
- Git ワークフロー自動化

## 開発標準

### 基本構造

```bash
#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

function usage() {
    cat <<EOF
Usage: $0 [OPTIONS] <arguments>

スクリプトの説明。

Arguments:
  arg1    引数1の説明

Options:
  -h, --help       ヘルプを表示
  -d, --dry-run    実行せずに内容を表示
EOF
}

function main() {
    # 実装
}

main "$@"
```

### エラー処理

```bash
# 前提条件の確認
if ! command -v required_command &> /dev/null; then
    echo "Error: required_command is not installed" >&2
    exit 1
fi

# 引数の検証
if [[ -z "${1:-}" ]]; then
    echo "Error: Argument required" >&2
    usage
    exit 1
fi

# エラーのハンドリング
if ! some_command; then
    echo "Error: Failed to execute some_command" >&2
    exit 1
fi
```

### オプション解析

**引数フォーマット標準:**

- `--flag='value'` 形式を使用する
- 位置引数はなるべく避ける
- 複数の値はカンマ区切り（例: `--env='dev,stg'`）

```bash
DRY_RUN=false
VERBOSE=false
TARGET=""
ENVIRONMENTS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        --target=*)
            TARGET="${1#*=}"
            shift
            ;;
        --env=*)
            ENVIRONMENTS="${1#*=}"
            shift
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage
            exit 1
            ;;
    esac
done
```

## ベストプラクティス

1. **変数はクォートする**: ワード分割を防ぐため必ずクォート

   ```bash
   echo "Processing file: $filename"
   ```

2. **リストには配列を使用**:

   ```bash
   ENVIRONMENTS=("dev" "stg" "prd")
   for env in "${ENVIRONMENTS[@]}"; do
       echo "Processing $env"
   done
   ```

3. **dry-run モードを提供**:

   ```bash
   if [[ "$DRY_RUN" == "true" ]]; then
       echo "[DRY RUN] Would execute: $command"
   else
       $command
   fi
   ```

4. **わかりやすい変数名を使う**:
   ```bash
   WORKFLOW_TYPE="daily"
   TERRAFORM_OUTPUT_DIR="/path/to/terraform"
   ```

## 共通パターン

### 確認プロンプト

```bash
if [[ "$NO_CONFIRM" == "false" ]]; then
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi
```

### 進捗表示

```bash
echo "Starting process..."
for item in "${items[@]}"; do
    echo "Processing $item..."
    if process_item "$item"; then
        echo "  ✓ Success"
    else
        echo "  ✗ Failed" >&2
    fi
done
echo "Done."
```

## テスト

### 手動テスト

1. まず dry-run でテスト
2. エラーケースをテスト
3. クリーンな環境でテスト

### 自動テスト

複雑なスクリプトの場合:

- テストフィクスチャを作成
- bash テストフレームワーク（bats）を使用
- 重要なスクリプトに CI テストを追加

## セキュリティ考慮事項

1. シークレットをハードコードしない — 環境変数またはシークレット管理を使用
2. 入力を検証する — ユーザー入力やファイルパスを必ず検証
3. 絶対パスを使用する — パストラバーサル脆弱性を回避
4. 適切な権限を設定する — 実行可能スクリプトには `chmod 755`
