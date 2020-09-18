#!/bin/bash
# Source from: https://github.com/houqp/download-release-assets-action

set -e

if [ -z "$OS" ]; then
    echo "OS must be set"
    exit 1
fi

if [ -z "$RENAME" ]; then
    RENAME="latest"
fi

REPO="loki-project/loki-core"
RELEASE="latest"

if [ "$OS" == "Linux" ]; then
    FILE_NAME_REGEX="linux"
elif [ "$OS" == "Windows" ]; then
    FILE_NAME_REGEX="win"
elif [ "$OS" == "macOS" ]; then
    FILE_NAME_REGEX="osx"
else
    echo "OS must be Linux, Windows or macOS"
    exit 1
fi


ASSET_URL=$(curl -sL --fail \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO}/releases/${RELEASE}" \
    | jq -r ".assets | .[] | select(.name | test(\"${FILE_NAME_REGEX}\")) | .url")

curl -sL --fail \
    -H "Accept: application/octet-stream" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -o "${RENAME}" \
    "$ASSET_URL"
