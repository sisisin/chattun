#!/usr/bin/env bash

set -ef -o pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir

mode=""
project_id=""
for i in "$@"; do
    case "$i" in
    --only-build*)
        mode="only-build"
        shift
        ;;
    --project-id=*)
        project_id="${i#*=}"
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
if [ -z "$project_id" ]; then
    echo "Error: --project-id is required" >&2
    exit 1
fi

should_build=true
should_deploy=true

if [ "$mode" = "only-build" ]; then
    should_deploy=false
fi

cd "$script_dir/.."

ts=$(TZ=JST-9 date "+%Y%m%d-%H%M%S")
image_name='sisisin/chattun-server'
image_id=${image_name}:$ts

if [ "$should_build" = true ]; then
    echo "Building image..."

    docker build --platform linux/amd64 -t "$image_id" .

    echo "Image built: $image_id"
fi

if [ "$should_deploy" = true ]; then
    docker push "$image_id"

    sed -i '' "s|image: .*|image: $image_id|" service.yaml

    gcloud run services replace ./service.yaml --project "$project_id"
fi
