#!/bin/bash -e

VERSION=${1}
if [[ "${VERSION}" == "" ]]; then
  echo "Error: Please specified version!"
  exit 1;
fi

ARCHIVE_NAME="dark-mode-plugin-${VERSION}.zip"

mkdir -p archive

cp dist/app.js build/js
if [[ "${?}" -ne 0 ]]; then
  exit 1
fi

cp dist/config.js build/js
if [[ "${?}" -ne 0 ]]; then
  exit 1
fi

npx garoon-plugin-packer --out "archive/${ARCHIVE_NAME}" build
if [[ "${?}" -ne 0 ]]; then
  exit 1
fi

exit 0
