# Task: InstallProviderのstateSecretを環境変数から読み込むようにする

## 達成条件

- stateSecretが環境変数(SLACK_STATE_SECRET)から読み込まれること
- config.tsにexportが追加されていること
- vp checkが通る

## 背景

handleInstallPath切り替えでstate CSRF検証が実際に機能するようになった。
stateSecretはstate JWTの署名鍵であり、ハードコードから環境変数に移行する必要がある。
