---
name: sandbox-denied-troubleshooting
description: sandbox-exec の権限拒否のトラブルシューティングガイド。macOS sandbox-exec ポリシーによる "Operation not permitted" エラーが発生した場合に使用。
---

# Sandbox 権限拒否のトラブルシューティング

`tools/claudecode/sandbox.sb` のサンドボックスポリシーに起因する `Operation not permitted` エラーの解決ガイド。

## 解決手順

1. エラーメッセージから**拒否されたパス**を特定する。

2. **そのパスが開発作業に必要な場合**、`tools/claudecode/sandbox.sb` を修正してパスを許可する。

3. `sandbox.sb` の変更を**コミット**する。

4. **ユーザーに Claude Code の再起動を依頼する** — サンドボックスポリシーの変更は次の `sandbox-exec` 起動時に有効になる。現在のセッションは古いポリシーのまま動作し続ける。

## 重要な注意事項

- サンドボックスを迂回したり `(deny file-write*)` ディレクティブを削除したりしないこと。サンドボックスはシステム保護のために存在する。
- 開発ワークフローに真に必要なパスのみを追加する。

## デバッグのヒント

sandbox.sb ファイルには `(debug deny)` ディレクティブが含まれており、拒否された操作はすべて macOS システムログに記録される。リアルタイムで拒否を監視するには:

```bash
sudo log stream --predicate 'sender == "Sandbox"' | grep deny
```
