#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

script_dir=$(cd "$(dirname "$0")" && pwd)
readonly script_dir

tag=""
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

if [ -z "$tag" ]; then
  echo "Error: --tag is required" >&2
  exit 1
fi

source "$script_dir/_lib.sh"

deploy "$tag"
