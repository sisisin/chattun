# Learnings: HTTPS 証明書セットアップ

## 設計判断

- CERT_DIR をスクリプトにハードコードせず、.env.local から読み込む方式にした
- CERT_DIR 未設定時は openssl で自己署名証明書を自動生成し、どの環境でも HTTPS が動くようにした
- vite.config.ts で tmp/ の証明書を自動検出するフォールバックを追加し、.env.local に SSL_CRT_FILE/SSL_KEY_FILE を手動設定する手間を省いた

## 注意点

- myinfra は private repo なので README に参照を入れない
