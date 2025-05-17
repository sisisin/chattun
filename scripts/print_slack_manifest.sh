#!/usr/bin/env bash

set -eu -o pipefail

repo_root=$(git rev-parse --show-toplevel)
readonly repo_root

target="$1"
if [[ "$target" != "dev" && "$target" != "prod" ]]; then
  echo "Usage: $0 <dev|prod>"
  exit 1
fi

app_name=""
server_url=""
case "$target" in
dev)
  app_name="chattun-dev"

  server_url="\"https://${LOCAL_DOMAIN}:3000/api/slack/oauth_redirect\",\"https://${LOCAL_DOMAIN}:3100/api/slack/oauth_redirect\""
  ;;
prod)
  app_name="chattun-app"
  server_url="\"$(terraform -chdir="$repo_root/terraform" output -raw chattun_server_url)\""
  ;;
esac

cat "$repo_root/slack-app.tmpl.json" | sed "s|__PLACEHOLDER_REDIRECT_URLS__|$server_url|g" | sed "s|__PLACEHOLDER_APP_NAME__|$app_name|g" >"$repo_root/slack-app.json"
