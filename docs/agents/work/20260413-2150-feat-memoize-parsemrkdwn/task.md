# Task: MrkdwnContent の parseMrkdwn 呼び出しを useMemo でメモ化する

## 原文

- Task: MrkdwnContent の parseMrkdwn 呼び出しを useMemo でメモ化する
  - MrkdwnRenderer.tsx:88 で毎レンダリング parseMrkdwn(text) が呼ばれている。text が変わらなければ再パース不要

## 達成条件

- MrkdwnContent で parseMrkdwn(text) の結果を useMemo でキャッシュする
- text が同じなら再パースしない
- lint / type-check が通る
