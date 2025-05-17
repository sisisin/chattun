#!/usr/bin/env bash

set -eu -o pipefail

repo_root=$(git rev-parse --show-toplevel)
readonly repo_root

server_url=$(terraform -chdir="$repo_root/terraform" output -raw chattun_server_url)

cat "$repo_root/slack-app.tmpl.json" | sed "s|__PLACEHOLDER_REDIRECT_URL__|$server_url|g" >"$repo_root/slack-app.json"
