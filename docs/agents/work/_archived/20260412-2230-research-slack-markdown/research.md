# Slack mrkdwn 対応 調査結果

## 1. Slack mrkdwn と標準 Markdown の構文差異

| 要素 | Slack mrkdwn | 標準 Markdown | 差異の重大度 |
|------|-------------|---------------|-------------|
| 太字 | `*bold*` | `**bold**` | 高 — markdown-itでは`*text*`をイタリックと解釈 |
| イタリック | `_italic_` | `_italic_` / `*italic*` | 低 — `_`は同じだが`*`の意味が異なる |
| 打ち消し線 | `~strike~` | `~~strike~~` | 中 — チルダの数が異なる |
| インラインコード | `` `code` `` | `` `code` `` | なし |
| コードブロック | ` ```code``` ` | ` ```code``` ` | なし |
| 引用 | `>` 行頭 | `>` 行頭 | なし |
| リンク | `<url\|text>` | `[text](url)` | 高 — 形式が根本的に異なる |
| 見出し | なし | `# ## ###` | - |
| 画像 | なし | `![alt](url)` | - |
| テーブル | なし | パイプ構文 | - |
| リスト | 公式構文なし | `- ` / `1. ` | - |

### mrkdwn 固有の構文

- ユーザーメンション: `<@U012AB3CD>` → 現在`toMention()`で処理済み
- チャンネル参照: `<#C123ABC456|name>` → 現在`toMention()`で処理済み
- グループメンション: `<!subteam^GROUPID|@name>` → 現在`toMention()`で処理済み
- 特殊メンション: `<!here>`, `<!channel>` → 現在`toMention()`で処理済み
- 日付フォーマット: `<!date^timestamp^format^link|fallback>` → 未対応
- メールリンク: `<mailto:user@example.com|text>` → 未対応

## 2. 現在の処理パイプライン

`textToHtml()` in `TimelineQuery.ts`:

1. `toMention()` — `<@UID>`, `<!channel|here>`, `<!subteam^...>`, `<#CID|name>` をregexで展開
2. `textWithAttachmentToText()` — 画像添付の処理
3. `textToEmojified()` — `:emoji:` を絵文字に変換
4. `textToMd()` — **markdown-it** で HTML に変換

**現在の問題点:**
- `*bold*` がイタリックとして表示される（Slackでは太字）
- `~strike~` が認識されない
- `<url|text>` リンクが処理されない（メンション系のみ`toMention()`で対応）

## 3. Slack APIが送信するデータ

Socket Mode で受信した `message` イベントの `text` フィールドは生の mrkdwn テキスト。
Slack がリンクを `<url|text>` 形式に、メンションを `<@UID>` 形式にサーバーサイドで変換済み。

最近のSlackクライアントは `blocks` 配列に `rich_text` ブロックも送信するが、本プロジェクトでは未使用。

## 4. 既存ライブラリ比較

### slack-markdown (Sorunome/slack-markdown)

- npm週間DL: ~14,400 / GitHub: 30 stars
- 最終コミット: **2020年1月**（メンテナンス停止）
- `simple-markdown`ベースのregexパーサー（~400行）
- 対応: 太字、イタリック、打ち消し、コード、引用、メンション、チャンネル参照、リンク、絵文字
- コールバックでカスタムレンダリング可能

### @clearfeed-ai/slack-to-html

- npm週間DL: ~888 / GitHub: 0 stars
- fork元のfork。対応範囲は一定だがコミュニティが極めて小さい

### slack-mrkdwn (gooody/slack-mrkdwn)

- npm週間DL: ~167 / GitHub: 1 star
- 最終コミット: **2021年1月**（メンテナンス停止）
- メンションやリンクの処理への言及なし。極めてマイナー

## 5. 実装アプローチの比較

### Option A: slack-markdown ライブラリに置き換え

`markdown-it` を削除し、`slack-markdown` の `toHTML()` に差し替え。

| 観点 | 評価 |
|------|------|
| mrkdwn構文の正確性 | 高 — 専用パーサーなので正しく解釈 |
| 変更範囲 | 中 — `textToMd()` 置換 + `toMention()` をコールバックに統合 |
| 外部依存リスク | 中 — 6年間メンテナンスされていないが、~400行なのでfork可能 |
| 既存機能との統合 | `toMention()` のロジックをコールバックに移動する設計が必要 |
| markdown-it機能の喪失 | 見出し、テーブル等が使えなくなるが、mrkdwnにはそもそも存在しない |

### Option B: mrkdwn を標準 Markdown にプリプロセス

`textToMd()` の前に変換関数を挟む（`*bold*` → `**bold**` 等）。

| 観点 | 評価 |
|------|------|
| mrkdwn構文の正確性 | 中 — 変換ルールが複雑、エッジケースに弱い |
| 変更範囲 | 小 — 変換関数を1つ追加するだけ |
| 外部依存リスク | なし |
| 既存機能との統合 | 既存パイプラインにそのまま組み込める |
| 懸念点 | コードブロック内の`*`や`~`を変換してはいけない等、regex条件が複雑化 |

### Option C: カスタム regex で全てHTML変換

`toMention()` と同様のアプローチを拡張し、全mrkdwn構文をregexでHTMLに変換。

| 観点 | 評価 |
|------|------|
| mrkdwn構文の正確性 | 低〜中 — ネスト構文の処理が困難 |
| 変更範囲 | 中 — regex追加だが、テストケースが多い |
| 外部依存リスク | なし |
| 既存機能との統合 | `toMention()` パターンの延長で自然 |
| 懸念点 | 実質的にパーサーを自作することになり保守コスト高 |

### Option D: markdown-it プラグイン

markdown-it のカスタムルールを書いて `*bold*`（太字）、`~strike~` 等を処理。

| 観点 | 評価 |
|------|------|
| mrkdwn構文の正確性 | 中 — コアルールの上書きが必要で複雑 |
| 変更範囲 | 大 — markdown-it内部のパーサールール理解が必要 |
| 外部依存リスク | なし |
| 既存機能との統合 | markdown-itのアーキテクチャに沿うが、mrkdwnは本質的にMarkdownではないため相性が悪い |
| 懸念点 | `*`のデフォルト動作（イタリック/太字）を上書きする必要があり、かなりの内部知識が要る |

## 6. 検討のポイント

### mrkdwn は Markdown ではない

最も重要な認識は、Slack mrkdwn は Markdown の方言ではなく、独自のフォーマットであるということ。
`*`の意味が根本的に異なる（Markdown: イタリック、mrkdwn: 太字）ため、Markdown パーサーで処理するのは本質的に無理がある。

### `blocks` / `rich_text` への対応も将来的に検討

Slack の最近のメッセージは `blocks` 配列に構造化された `rich_text` ブロックを含む。
これを使えばパース不要で構造化されたレンダリングが可能だが、本プロジェクトでは型定義すらなく大きな変更になる。
長期的にはこちらが正解だが、短期的には `text` フィールドのmrkdwn処理改善が現実的。

### 参考: 現在の処理で「動いている」もの

- インラインコード、コードブロック → markdown-itが正しく処理
- `_italic_` → markdown-itが正しく処理
- メンション → `toMention()`が処理
- 絵文字 → `textToEmojified()`が処理
- 引用 → markdown-itが正しく処理

### 参考: 現在「壊れている」もの

- `*bold*` → イタリックとして表示される
- `~strike~` → そのまま表示される
- `<url|text>` → そのまま表示される（メンション以外のリンク）
