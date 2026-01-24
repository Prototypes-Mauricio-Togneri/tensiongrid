#!/usr/bin/env bash

set -e

# Get UTC timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M")

# Update version in constants.js
sed -i "s/version: '.*'/version: '${TIMESTAMP}'/" public/js/constants.js

echo "Updated version: ${TIMESTAMP}"
