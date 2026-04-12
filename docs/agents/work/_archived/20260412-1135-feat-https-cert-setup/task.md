# Task: httpsが自己署名証明書使ってるのをやめる

## 達成条件

- copy_pem.sh で持ってきた let's encrypt 証明書を自動的に利用する
- .env.local に SSL_CRT_FILE/SSL_KEY_FILE を手動設定しなくても、tmp/ に証明書があれば自動で HTTPS が有効になる
- ブラウザで開いたときに警告が出ない
- copy_pem.sh のデフォルト CERT_DIR を local.sisisin.house に設定

## 背景

vite.config.ts は .env.local の SSL_CRT_FILE/SSL_KEY_FILE を読む仕組みがあるが、手動で .env.local に記載が必要。
copy_pem.sh で tmp/ にコピーした証明書を自動検出するようにすれば、セットアップが簡略化される。

## スコープ

- vite.config.ts: tmp/ の証明書を自動検出するフォールバック追加
- copy_pem.sh: デフォルト CERT_DIR を設定
- README.md: HTTPS セットアップ手順を簡略化
