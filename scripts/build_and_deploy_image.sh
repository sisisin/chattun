#!/usr/bin/env bash

set -ef -o pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir

output=$(terraform -chdir=${script_dir}/../terraform output -json)
region=$(echo "$output" | jq -r '.region.value')
chattun_service_name=$(echo "$output" | jq -r '.chattun_server_name.value')
chattun_server_service_account=$(echo "$output" | jq -r '.chattun_server_service_account.value')
chattun_server_url=$(echo "$output" | jq -r '.chattun_server_url.value')
project_id=$(echo "$output" | jq -r '.project_id.value')
registry_name=$(echo "$output" | jq -r '.registry_name.value')

mode=""
for i in "$@"; do
  case "$i" in
  --only-build*)
    mode="only-build"
    shift
    ;;
  --*= | --*)
    echo "Error: Unsupported flag $1" >&2
    exit 1
    ;;
  *)
    echo "Error: Unsupported flag $1" >&2
    exit 1
    ;;
  esac
done

should_build=true
should_deploy=true

if [ "$mode" = "only-build" ]; then
  should_deploy=false
fi

cd "$script_dir/.."

ts=$(TZ=JST-9 date "+%Y%m%d-%H%M%S")
image_name="$region-docker.pkg.dev/$project_id/$registry_name/$chattun_service_name:$ts"

if [ "$should_build" = true ]; then
  echo "Building image..."

  docker build --platform linux/amd64 -t "$image_name" .

  echo "Image built: $image_name"
fi

if [ "$should_deploy" = true ]; then
  gcloud auth configure-docker "${region}-docker.pkg.dev" --quiet
  docker push "$image_name"

  gcloud run deploy "$chattun_service_name" \
    --project "$project_id" \
    --image "$image_name" \
    --region "$region" \
    --platform managed \
    --service-account "$chattun_server_service_account" \
    --allow-unauthenticated \
    --set-env-vars "SERVER_BASE_URL=$chattun_server_url"
fi
