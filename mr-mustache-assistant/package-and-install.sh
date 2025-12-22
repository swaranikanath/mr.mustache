#!/usr/bin/env bash
set -euo pipefail

# Build and package the VS Code extension and move the VSIX to the repository root.
cd "$(dirname "$0")"
echo "Installing dependencies..."
npm ci || npm install

echo "Installing vsce (best-effort)..."
npm install -g vsce || true

echo "Packaging extension..."
vsce package || true

echo "Moving VSIX to repository root (if created)..."
for f in *.vsix; do
  if [ -f "$f" ]; then
    mv -f "$f" ..
    echo "Moved $f to .."
  fi
done

echo "Done. If a VSIX was created, it's in the repository root."
