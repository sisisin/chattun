# Learnings: hooks.ts exhaustive-deps revert

## exhaustive-depsのsuppressが正しい場合がある

マウント時に1回だけ実行したいuseEffectでは空依存配列`[]`が正しい設計判断。
exhaustive-depsルールのsuppressを機械的に「修正すべきもの」として扱わず、意図を確認すべき。
