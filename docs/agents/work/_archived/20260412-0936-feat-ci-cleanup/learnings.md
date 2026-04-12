# Learnings

## workflow_run vs 同一ワークフロー内のnotifyジョブ

- `workflow_run` トリガーは別ワークフローの完了を検知するが、ジョブ結果の取得にAPI呼び出しが必要
- 同一ワークフロー内なら `needs.*.result` で直接参照でき、シンプル
- `if: always()` を付けないと上流ジョブ失敗時にnotifyジョブがスキップされる

## ジョブ結果の判定

- GitHub Actions のジョブresultは `success`, `failure`, `cancelled`, `skipped` がある
- 通知で成功/失敗を判定する場合、`failure` だけでなく `cancelled` も考慮が必要
- `!== 'success'` で判定するのが安全
