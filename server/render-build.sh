#!/usr/bin/env bash
# Run from repo root on Render (Root Directory = server)
set -euo pipefail
echo "==> Installing API dependencies in $(pwd)"
if ! npm ci; then
  echo "WARN: npm ci failed, retrying with npm install..."
  npm install --omit=dev
fi
test -f node_modules/express/package.json || {
  echo "ERROR: express was not installed — build failed"
  exit 1
}
echo "==> API dependencies OK ($(ls node_modules | wc -l | tr -d ' ') packages)"
