#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir

tag=$(date "+%Y%m%d-%H%M%S")
for i in "$@"; do
  case "$i" in
  --tag=*)
    tag="${i#*=}"
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

source "$script_dir/_lib.sh"

"$script_dir/build_image.sh" --tag="$tag"
"$script_dir/deploy.sh" --tag="$tag"
