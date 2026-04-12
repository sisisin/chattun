#!/usr/bin/env bash

set -eu -o pipefail
script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir
readonly out_dir="$script_dir/../tmp"

# .env.local から CERT_DIR を読み込む（環境変数で未設定の場合）
if [ -z "${CERT_DIR:-}" ] && [ -f "$script_dir/../.env.local" ]; then
  CERT_DIR=$(grep '^CERT_DIR=' "$script_dir/../.env.local" | cut -d= -f2- | xargs) || true
fi

mkdir -p "$out_dir"

if [ -n "${CERT_DIR:-}" ]; then
  echo "Copying certificates from $CERT_DIR ..."
  if [ ! -d "$CERT_DIR" ]; then
    echo "Error: CERT_DIR ($CERT_DIR) does not exist."
    exit 1
  fi
  sudo cp "$CERT_DIR/privkey.pem" "$out_dir/privkey.pem"
  sudo cp "$CERT_DIR/fullchain.pem" "$out_dir/fullchain.pem"
  sudo chown "$USER" "$out_dir/privkey.pem" "$out_dir/fullchain.pem"
  echo "Copied let's encrypt certificates to tmp/"
else
  echo "CERT_DIR not set. Generating self-signed certificate ..."
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$out_dir/privkey.pem" \
    -out "$out_dir/fullchain.pem" \
    -days 365 \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "Generated self-signed certificate in tmp/"
  echo "Note: Browsers will show a security warning with self-signed certs."
  echo "To use a trusted certificate, set CERT_DIR in .env.local"
fi
