# Task: select boxのアイコンが文字と被る問題を修正

## 達成条件
- select box内のテキストがドロップダウンアイコン（v字）と被らない
- アイコンの位置がselect boxのサイズに応じて適切に調整される

## 背景
- `appearance: none`でネイティブの矢印を消し、IconArrowをabsoluteで配置している
- selectのテキストがpadding-right不足でアイコンの下に入り込む

## スコープ
- _form.cssのselect要素にpadding-rightを追加してアイコン分のスペースを確保
- select-group-chaticonの位置を適切に調整
