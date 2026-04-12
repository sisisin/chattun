# Done

- Task: requestパッケージをNode.js標準のfetchに置き換えて削除する
  - /api/fileエンドポイントのSlackファイルプロキシをfetch+Readable.fromWebに移行
  - request, @types/requestを削除
- Task: serverのtypescript本番依存をなくす。Node.jsネイティブTS実行(ESM)に移行
  - serverをESM化（"type": "module"、tsconfig module/moduleResolution: nodenext）
  - 全importに.ts拡張子追加、__dirname→import.meta.dirname
  - CJSパッケージのnamed importをdefault import+destructuringに変換
  - ts-node, typescript, nodemonをserver/dependenciesから削除
  - Dockerfile CMD: node --experimental-strip-types、dev: node --watch
- Task: serverでモダナイズが必要な点がないかをレビューし、Taskとして追加する
  - 依存関係: request(deprecated)、ioredis 4→5、connect-redis 4→9、helmet 4→8等のアップデートタスクを追加
  - コード品質: lint warning解消（未使用import、デバッグエンドポイント削除）タスクを追加
  - express 5はBreaking Changeが大きいためBacklog行き
- Task: serverでvp checkを利用する
  - vp-shared.tsに共通fmt/lint設定を切り出し、front/serverのvite.config.tsで共有
  - server/vite.config.ts作成（fmt+lint設定）、ci scriptをvp checkに変更
  - ルートvite.config.tsのstagedにserver追加、Dockerfileにvp-shared.tsコピー追加
  - server全ソースをoxfmtでフォーマット
- Task: serverのnpm scriptsをvp task化 + repo root運用
  - 各パッケージにci script追加（front: vp run test-all, server: tsc --noEmit）
  - git hooksをfront/.vite-hooks/からルート.vite-hooks/に移動（pre-commit: vp staged, pre-push: vp run -r ci）
  - ルートにvite.config.ts（staged設定のみ）追加、ルートpackage.jsonにprepare: "vp config"
  - Dockerfile両ステージに--ignore-scripts追加、CI統一
- Task: typescriptなどの共通の依存をrootに移動
  - typescript(6.0.2), @types/node(22.19.17), vite(8.0.8), vite-plus(0.1.16)をルートに集約
  - server の TypeScript を 5.8.3 → 6.0.2 に統一
  - front から @types/node を削除（src では Node.js API 未使用）
- Task: pnpm workspaceのlockfileをrootに統合する
  - shared-workspace-lockfile=false を廃止、ルート単一lockfileに移行
  - pnpm overrides/patchedDependencies をルート package.json に移動
  - server に @types/node を明示追加、Dockerfile・CI workflow をワークスペース構成に対応
  - .npmrc に save-exact=true を追加
- Task: move-assetsタスク削除、Dockerfileでbuild出力を直接COPY
- Task: pnpm workspace化
  - shared-workspace-lockfile=falseで各パッケージの既存lockfileを維持しつつworkspace化
  - server: @types/express追加（pnpm strict resolution対応）
- Task: serverのpnpm化
  - pnpm importでyarn.lockからpnpm-lock.yaml生成、Dockerfile・CI・ドキュメント更新
  - Dockerfileのfront/patchesコピー漏れも修正（既存バグ）
- Task: skill類を日本語化する
  - local-reviewer.md, start-local-review.md, do-task, skill-dev, shell-scripting, sandbox-denied-troubleshootingの6ファイルを日本語化
  - 不要なupdate-lightdash.mdを削除、壊れたgit-push.sh参照をgit pushに修正
- Task: ブラウザ動作確認エージェントを独立定義し、local-reviewのBrowser Verification Phaseを置き換える
  - .claude/agents/browser-verifier.md として独立エージェント化、start-local-review.md からはエージェント参照に置き換え
- Task: httpsが自己署名証明書使ってるのをやめる
  - setup_pem.sh: CERT_DIRあればコピー、なければ自己署名証明書を自動生成。vite.config.tsでtmp/を自動検出
- Task: dynamic importによるchunkを適切に行えるように実装を調整
  - @loadable/component は TanStack Router 移行タスクで削除済み。lazyRouteComponent で code splitting が適切に動作
- Task: react-router-dom v5 を TanStack Router に移行
  - history, @loadable/component も併せて削除。lazyRouteComponent で code splitting を維持
- Task: react-hook-form を削除しネイティブ FormData API に移行
  - 利用箇所が2ファイルのみでAPIも単純だったため、ライブラリ移行ではなく削除で対応

- Task: Cloud Runのエラーログが構造化ログになっていない問題を修正する
  - Cloud Run上でSocket.IOのWebSocket接続（`/socket.io/?EIO=4&transport=websocket`）が500/503を返しているが、アプリケーション側の構造化ログと紐づいていない
  - Cloud Runのリクエストログ（`run.googleapis.com/requests`）のエラーに対応するアプリケーションログが構造化されていない可能性を調査・修正する

- Task: Socket.IO WebSocket接続で500/503エラーが発生する原因を調査し、原因不明の場合はアプリケーションが問題なく動作するよう修正する
  - 根本原因: unhandled rejection → Node.js exit(1) → Cloud Runインスタンスのクラッシュ連鎖
  - unhandledRejectionハンドラをトップレベルに追加し、プロセスをクラッシュさせずに構造化ログ記録するよう修正

- Task: 未認証ソケットのdisconnect時にクライアントへ適切に通知し、再接続ループを防止する
  - サーバー側: socket.disconnect(true)でクライアントに"io server disconnect"を送信（自動再接続されない）
  - クライアント側: disconnectイベントのreasonで判定し、セッション切れをalertで通知→/loginへリダイレクト

- Task: 別サーバーとしてモックサーバーを実装して、slack appをセットアップしなくてもFEが動くようにし、メッセージの見た目を確認できるようにする
  - 本番コードには手を入れず、`server/mock-server/` に独立したExpress+Socket.IOサーバーを作成
  - モックサーバーは認証不要で /api/connection にモックレスポンスを返し、Socket.IO で無条件接続を受け付け
  - モック用イベント発行httpエンドポイント（raw + プリセット）を実装
  - FE側は REACT_APP_MOCK_MODE 環境変数で MockSlackClient に切り替え、/api/mock/bootstrap からモックデータ取得
  - モック用アセット配信は express.static で実装

- Task: モックサーバーを利用した開発手順を/skill-dev を利用してclaude skillとして定義する
  - `.claude/skills/mock-dev/SKILL.md` を作成。start/preset/event/listの各サブコマンドに対応

- Task: Storybookを消す
  - @storybook/* パッケージ、storycap, story2sketch, reg-suit関連パッケージを削除
  - .storybook/ ディレクトリ、storiesファイル、utility/storybook/ ヘルパー、regconfig.json を削除
  - CSS内の.storybook-iconsクラス、ソース内のStorybook TODOコメント、eslintrcのstories override設定を削除
  - yarn.lock を更新

- Task: stylelintを消す
  - stylelint関連パッケージ6個を削除、スクリプト(stylelint, stylelint-fix)を削除
  - .stylelintrc.json, .stylelintignoreを削除
  - postcss.config.jsからstylelintプラグイン参照を削除、lint-staged.config.jsからstylelint参照を削除
  - yarn.lock を更新

- Task: lint-stagedを消す
  - lint-staged.config.jsを削除、package.jsonからhusky設定・lint-staged/huskyパッケージを削除
  - huskyはlint-staged専用のpre-commitフックのみだったため一緒に削除
  - yarn.lock を更新

- Task: vite+を調べて、最低限の概要と出来ることを /skill-dev を利用してskillとしてまとめる
  - .claude/skills/vite-plus/SKILL.md を作成（user-invocable: false、背景知識として自動参照）
  - CLIコマンド、vite.config.ts設定例、マイグレーション手順、パフォーマンス比較、ESLint/Prettier/Jest移行メモを記載
  - vite+公式からskillを得る方法（npx skills add）も確認したが、Claude Code標準のプラグイン仕組みとは異なるためプロジェクト内に直接作成

- Task: eslintを消し、vite+のlintに変更する
  - vite-plusを導入し、vite.config.tsにlint設定を集約（no-restricted-imports, react-hooks, typescript関連ルール）
  - eslint関連パッケージ(eslint-config-prettier, eslint-plugin-jest, eslint-plugin-prettier)・設定ファイル(.eslintrc.js, .eslintignore)を削除
  - craco.config.jsでCRA内蔵eslintを無効化、eslint-disableコメントをoxlint対応に置換
  - Node.jsを22.18.0に更新、lint結果は0 warnings 0 errors

- Task: slackをサーバーをプロキシとして叩くようにして、slack clientの依存を消す
  - サーバー側にSlack APIプロキシエンドポイント9個を追加（emoji.list, users.list, conversations.list, team.info, reactions.add/remove, conversations.replies/mark, auth.test）
  - フロントのSlackClient.tsをfetch()ベースのプロキシ呼び出しに書き換え
  - @slack/web-api, slack, os-browserify, path-browserifyをフロントから削除、craco.config.jsのpolyfill設定も整理
  - accessTokenのフロント返却を廃止、express.json()をグローバル配置、startRtmデッドコード削除
  - babel-runtime, @types/webpack-envをyarn hoisting変更対応として明示追加

- Task: oxlint移行時にsuppressしたlint ignoreを解消する
  - hooks.ts: useEffectの依存配列を修正、useActionsの不安定参照をuseRefパターンで安定化しexhaustive-deps suppressを削除
  - App.test.tsx: DefaultTypelessProviderをTypelessContext.Providerに移行しno-restricted-imports suppressを削除

- Task: DockerfileのNodeバージョンを22.18.0に更新してデプロイ失敗を修正する
  - Dockerfile builder/runnerのベースイメージをnode:22.11.0→22.18.0に更新
  - server/package.jsonのengines.nodeも^22.18.0に揃えた

- Task: hooks.tsのuseEffect依存配列を元の[]に戻し、exhaustive-deps suppressを復元する
  - マウント時に1回だけObserverを登録する意図で空配列が正しい設計判断
  - useRefパターンへの不要な変更を元に戻した

- Task: prettierを消し、vite+のformatterに変更する
  - prettierパッケージを削除、vite.config.tsにfmt設定を追加（printWidth:100, singleQuote, trailingComma等）
  - format/format-checkスクリプトをvp fmt/vp lintベースに変更
  - oxfmtで全ファイルをフォーマット適用、CLAUDE.mdのコマンド説明も更新

- Task: 開発用コマンドをvite+タスクに定義して、npm-run-allを消す
  - vite.config.tsのrun.tasksにビルド・開発タスクを定義（dependsOnで依存関係表現）
  - package.jsonのスクリプトをvp runベースに変更
  - npm-run-allパッケージを削除

- Task: ExecTasksのワークフローを改善する — task.md作成とレビュー観点の構造化
  - exectasks-guideにtask.md作成ステップを追加
  - start-local-reviewスキルのレビュワープロンプトにtask.mdパスを渡す形に更新

- Task: テストをvite+に変更する
  - テストランナーをcraco test (Jest)からvp test run (Vitest)に移行
  - vite.config.tsにtest設定(jsdom, globals, configDefaults.exclude)、oxc jsx classic、resolve.aliasを追加
  - @types/jestを削除、package.jsonのtestスクリプトを更新、CLAUDE.md更新

- Task: vpにlint-staged的な機能があるか調査し、commit hookを設定する
  - vp staged（lint-staged相当）とvp config（husky相当）を利用
  - vite.config.tsにstaged設定（vp check --fix）を追加
  - pre-commitフックでvp stagedを実行、prepareスクリプトでvp configを自動実行

- Task: npm scriptsを空にして全てvp taskrunner機能に寄せる
  - format, format-check, test-all, move-assets, g, gmをvite.config.tsのrun.tasksに移行
  - vp run --parallelはconfig定義不可（CLIフラグのみ）→ start, start-nmはnpm scriptsに残留
  - Dockerfile, CI workflow, CLAUDE.mdをyarn vp run形式に更新

- Task: create-react-appをvite+へ移行する。画面が正常に表示できることを確認する
  - CRA関連依存（react-scripts, @craco/craco, @babel/core, babel-loader, http-proxy-middleware, @types/webpack-env）を削除
  - index.htmlをpublic/からfront/ルートへ移動、%PUBLIC_URL%→/、script type="module"追加
  - 環境変数をREACT_APP_*→VITE_*、process.env→import.meta.envに移行
  - module.hot→import.meta.hot、setupProxy.js→vite.config.tsのserver.proxy
  - vite.config.tsにserver.https設定を追加（.env.localからSSL_CRT_FILE/SSL_KEY_FILE読み取り）
  - README.md、CLAUDE.md、CI workflow、Dockerfileを更新

- Task: GitHub ActionsのCI/デプロイ状況を確認し、失敗があれば修正する + frontのみyarnからpnpmへ移行
  - vp configがpackageManager: "yarn@4.13.0"を書き込み、corepackがyarn 4を期待してCI/Dockerビルドが失敗
  - frontのパッケージマネージャをyarn 1.xからpnpmに移行することで根本解決
  - pnpm import でyarn.lockからpnpm-lock.yamlを生成、resolutions→pnpm.overridesに変更
  - CI: corepack enable pnpm + actions/setup-nodeのpnpmキャッシュ設定
  - Dockerfile: corepack enable pnpm + pnpm install --frozen-lockfile --ignore-scripts
  - CLAUDE.md, README.md, mock-dev SKILL.md のyarn→pnpm更新

- Task: CI整理
  - run--notify-deploy-completed.yaml（workflow_runトリガー）の通知処理をpush--build-and-deploy.yaml内のnotifyジョブに統合
  - ジョブ結果の判定を!== 'success'に変更し、cancelled等も失敗扱いに
  - run--notify-deploy-completed.yamlを削除

- Task: React 16→18にアップグレードする
  - react/react-domを16.13.0→18.3.1に更新、@types/react/@types/react-domを18系に更新
  - ReactDOM.render→createRoot API移行（index.tsx, App.test.tsx）
  - React 18でReact.FCからchildren型が削除された対応（Props型にchildren追加）
  - @types/react-router/react-router-domを最新v5に更新、emoji-mart EmojiData型明示

- Task: postcss-custom-mediaとpostcss-nestingをネイティブCSSに置き換え、postcss.config.jsを削除する
  - @custom-mediaをネイティブ@media値に展開、_media_queries.cssを削除
  - postcss.config.jsを削除、autoprefixerのみvite.config.tsのcss.postcssに移行
  - postcss-custom-media, postcss-nestingパッケージを削除

- Task: 不要なファイル・パッケージを削除する
  - story2sketch.config.js（Storybook削除後の残骸）、buffer/processパッケージ（CRA時代のpolyfill）を削除

- Task: 他にfrontでモダナイズが必要な点がないかをレビューし、その結果得られた必要であろう作業をTaskとして追加する
  - 不要ファイル/パッケージ削除、postcssネイティブ移行、React 18、react-router 6、strictFunctionTypesをTasksに追加
  - emoji-mart 5、rxjs 7、react-hook-form 7をBacklogに追加

- Task: frontの暗黙的な推移的依存を整理する
  - babel-runtime: emoji-mart 2.11.2が内部でrequireしているがdependenciesに未宣言（パッケージのバグ）。v5はフルリライトでAPI非互換のため現時点では明示的依存として維持
  - @types/webpack-env: CRA→vite+移行完了により既に削除済み

- Task: CSSをvite+で利用できる技術に移行し、postcssを消す
  - postcss-cli, cssnano, postcss-import, postcss-nested, postcss-custom-propertiesを削除
  - index.htmlの静的CSSリンクを削除、index.tsxにimport './app/css/main.css'を追加しViteのCSSパイプラインで処理
  - vite.config.tsからwatch-css/build-cssタスクを削除、postcss.config.jsはcustom-media/nesting/autoprefixerのみに簡素化
  - markdown-itのESMインポート修正（namespace→default import）、global: 'globalThis'ポリフィル追加

- Task: typescriptを最新にする
  - TypeScript 3.8.3→6.0.2にアップグレード
  - tsconfig.json: target es2020, module preserve, moduleResolution bundler、baseUrl→paths移行、suppressImplicitAnyIndexErrors削除
  - swSrc/tsconfig.json: ignoreDeprecations "6.0"追加（outFile非推奨対応）
  - vite, @types/history@4を明示的devDependencyに追加（pnpm strict resolution対応）
  - Routes.tsx keyプロップ重複修正、useRouter.ts型制約追加
  - test-allにvp checkを使い型チェックを含めるよう変更

- Task: service workerのビルドをvpに含めてビルドコマンドをvpに統一
  - Viteプラグイン(swPlugin)でbuildStart+configureServerフックを利用しtsc -p ./swSrcを実行
  - build-sw, watch-sw, start-jsタスクを削除、build-jsのdependsOnも除去
  - package.jsonのstartスクリプトをvp devのみに簡素化

- Task: npm scripts, vp tasksの簡素化
  - build-js→buildにリネーム、format/format-checkタスクを削除（vpビルトインコマンドで十分）
  - Dockerfile, CI, pre-push, CLAUDE.mdの参照を更新

- Task: tsconfig.jsonのstrictFunctionTypesをtrueにする
  - strictFunctionTypesをfalse→trueに変更
  - reduce()の型引数にSlackEntity.Message.Reaction[]を明示して型エラーを解消

- Task: emoji-mart 2→5にアップグレードする
  - emoji-mart 2.11.2→5.6.0、@emoji-mart/data、@emoji-mart/reactを追加
  - Pickerをv5 React版に移行（data prop、onEmojiSelect、custom categories形式）
  - Emojiコンポーネントをem-emoji Web Component＋カスタム絵文字はimg表示に移行
  - CustomEmoji型をローカル定義（v5形式: id, name, keywords, skins）に変更
  - babel-runtime、@types/emoji-martを削除、旧emoji-mart.css削除
  - alias絵文字のリアクション表示バグも修正

- Task: local-reviewのプロセス内にフロントの動作確認エージェントを含める
  - Browser Verification Phaseを追加: front/src配下のdiffがある場合にブラウザ検証サブエージェントを起動
  - 逐次実行でファイル競合を防止、lsofでdevサーバー起動確認、ラウンド番号の明示的伝達

- Task: rxjs 6→7にアップグレードする
  - rxjs 6.5.4→7.8.2にアップグレード
  - ajax()にジェネリック型引数追加、toPromise()→firstValueFrom()移行
  - typelessのrxjs/internal-compatibility依存をpnpm patchで解消
  - TypeScript 3.8.3→6.0.2にアップグレード
  - tsconfig.json: target es2020, module preserve, moduleResolution bundler、baseUrl→paths移行、suppressImplicitAnyIndexErrors削除
  - swSrc/tsconfig.json: ignoreDeprecations "6.0"追加（outFile非推奨対応）
  - vite, @types/history@4を明示的devDependencyに追加（pnpm strict resolution対応）
  - Routes.tsx keyプロップ重複修正、useRouter.ts型制約追加
  - test-allにvp checkを使い型チェックを含めるよう変更
