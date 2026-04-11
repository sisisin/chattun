# Learnings: feat/mock-mode

## 学び

### CRA の REACT_APP_* 環境変数はビルド時置換
- `process.env.REACT_APP_MOCK_MODE` はCRAのwebpack DefinePluginでビルド時にリテラル文字列に置換される
- ホットリロードでも再ビルドされるが、ページのフルリロードが必要な場合がある
- dev server起動時に環境変数を渡す必要がある（`REACT_APP_MOCK_MODE=true yarn start`）

### MockSlackClient パターン
- epicに条件分岐を入れるより、ISlackClient インターフェースを抽出して MockSlackClient クラスで差し替える方がクリーン
- ユーザーからのフィードバック: 「MockSlackClientクラス作ってそっちをインスタンス化じゃねえかなあ」

### express.static vs カスタムエンドポイント
- モック用アセット配信は `express.static` で十分。カスタムの sendFile ロジックは不要な複雑さ
- ユーザーからのフィードバック: 「express.staticでよくね？」

### FE初期化の制御
- FEの初期化モード切り替えは「フォールバック」パターンではなく、環境変数で明示的に制御すべき
- ユーザーからのフィードバック: 「フォールバックというかFEの初期化をモックモード環境変数で動作を調整ではなかろうか」

### CRA の BROWSER 環境変数
- `BROWSER=none` でCRA起動時の自動ブラウザオープンを抑制できる
- モックモードでは既存タブをリロードして使う方が便利

## 注目イベント

- ESLintキャッシュが原因で新規ファイルが「tsconfigに含まれていない」エラーになることがある → `node_modules/.cache` 削除で解消
- prettierの行長制限に引っかかるケースがあった（引数リストが長い関数シグネチャ）
