#!/usr/bin/env bash

set -e

# Get UTC timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M")

# Generate version.js
cat > public/js/version.js << EOF
const Version = '${TIMESTAMP}'
EOF

echo "Generated version.js: ${TIMESTAMP}"
