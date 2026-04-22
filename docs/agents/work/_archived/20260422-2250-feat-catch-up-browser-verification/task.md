# Task: スキップされたブラウザ検証をまとめて実施する

## Task定義（原文）

> スキップされたブラウザ検証をまとめて実施する
>   - `feat/resolve-attachment-mrkdwn`: attachment内のtext/pretextでMrkdwnContentを使いリンク・メンション・絵文字を解決する修正。自己署名証明書でBLOCKEDだった
>   - `fix/channel-header-in-menu`: チャンネルページのチャンネル名表示をh2からMenuヘッダーに移動した修正。/verifyなしでマージされた

## 解釈

### 達成条件

コード修正は不要。ブラウザで以下の動作が正しいことを確認する：

#### 1. attachment内のmrkdwn解決 (feat/resolve-attachment-mrkdwn)
- attachment の text 内のリンク（`<https://...>` 形式）がクリッカブルなリンクとして表示されること
- メンション（`<@U...>`）が解決されて表示されること
- 通常のメッセージ表示が壊れていないこと

#### 2. チャンネルヘッダー表示 (fix/channel-header-in-menu)
- チャンネルページ（/channel/$channelId）でチャンネル名がMenuのヘッダー部分に表示されること
- h2要素が存在しないこと
- Menuの「戻る」リンクが正常に動作すること

## 検証ステップ

- [x] browser-verification
