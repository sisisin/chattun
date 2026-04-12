# Learnings

## controlled component vs defaultValue
- 動的リスト（追加・削除可能）のフォーム行は controlled component（value + onChange）にすべき
- key={index} + defaultValue の組み合わせは、行削除時にDOMの再利用で値がずれる
- localState でUI状態を管理し、保存時のみ store に反映するパターンが有効

## カラートークンの使い分け
- `--text-main` はテーマのアクセントカラー（ピンク）であり、テキスト色としては薄い
- ボタンテキスト等の可読性が重要な箇所は `--text-base`（黒）を使う
- `--text-revert`（白）はプライマリボタン等の背景色付き要素のテキスト用

## verify スキル改善
- review と browser-verification は独立した検証なので並列起動が効率的
- ユーザーフィードバックに基づきスキルを逐次→並列に変更した
