# Learnings

## デザインガイドとスキルファイルの同期

デザインガイド (`docs/guide/ui-design.md`) に新しいセクションを追加した場合、実装リファレンスとなるスキルファイル (`.claude/skills/frontend-development/design.md`) にも要約を反映する必要がある。スキルファイルはデザインガイドの参照先として実装時に使われるため、ここにも最低限のルールを記載しないと実装者が見落とす。

## input/selectの実測高さ

padding: 8px + font-size: 1rem (16px) + border: 1px×2 = 実測約42px。button-removeは36px固定だが、align-items: centerで中央揃えされるので視覚的には揃っている。
