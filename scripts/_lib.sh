#!/usr/bin/env bash

readonly repo_root="$script_dir/.."

output=$(terraform -chdir=${script_dir}/../terraform output -json)
region=$(echo "$output" | jq -r '.region.value')
chattun_service_name=$(echo "$output" | jq -r '.chattun_server_name.value')
chattun_server_service_account=$(echo "$output" | jq -r '.chattun_server_service_account.value')
project_id=$(echo "$output" | jq -r '.project_id.value')
registry_name=$(echo "$output" | jq -r '.registry_name.value')

function echo_image_name() {
  local tag
  tag="$1"
  image_name="$region-docker.pkg.dev/$project_id/$registry_name/$chattun_service_name:$tag"
  echo "$image_name"
}

function build_image() {
  local tag
  tag="$1"
  image_name=$(echo_image_name "$tag")

  echo "Building image..."
  docker build --platform linux/amd64 -t "$image_name" -f "$repo_root/Dockerfile" "$repo_root"
  gcloud auth configure-docker "${region}-docker.pkg.dev" --quiet
  docker push "$image_name"

  echo "Image built: $image_name"
}

function deploy() {
  local tag
  tag="$1"
  local image_name
  image_name=$(echo_image_name "$tag")

  echo "Deploying image..."

  gcloud run deploy "$chattun_service_name" \
    --project "$project_id" \
    --image "$image_name" \
    --region "$region" \
    --platform managed \
    --service-account "$chattun_server_service_account" \
    --allow-unauthenticated
}
