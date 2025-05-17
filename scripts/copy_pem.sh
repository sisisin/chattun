#!/usr/bin/env bash

set -eu -o pipefail
script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir

if [ -z "$CERT_DIR" ]; then
  echo "CERT_DIR is not set. Please set it to the directory containing your PEM files."
  exit 1
fi

mkdir -p "$script_dir/../tmp"

sudo cp "$CERT_DIR/privkey.pem" "$script_dir/../tmp/privkey.pem"
sudo cp "$CERT_DIR/cert.pem" "$script_dir/../tmp/cert.pem"
