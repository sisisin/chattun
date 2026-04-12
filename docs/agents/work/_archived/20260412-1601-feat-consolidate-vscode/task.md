# Task: .vscodeをルートに統合・chattun.code-workspaceを消す

## 達成条件

- front/.vscode と server/.vscode の設定がルートの .vscode に統合されていること
- chattun.code-workspace が削除されていること
- workspace固有のcSpell設定がルート .vscode/settings.json に移行されていること
- vp checkが通る

## 背景

現在、front/.vscode、server/.vscode、chattun.code-workspace の3箇所にVS Code設定が散在している。
マルチフォルダワークスペースは使わずルートで開く運用に統合する。
