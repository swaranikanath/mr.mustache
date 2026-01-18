#!/usr/bin/env bash
set -euo pipefail

# Build and package the VS Code extension and move the VSIX to the repository root.
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Skipping packaging. To package locally, install Node.js/npm and run this script from the extension folder."
  exit 0
fi

echo "Installing dependencies..."
npm ci || npm install

echo "Installing vsce (best-effort)..."
if ! command -v vsce >/dev/null 2>&1; then
  echo "vsce not found; attempting to use npx @vscode/vsce..."
  if command -v npx >/dev/null 2>&1; then
    echo "Packaging with npx @vscode/vsce..."
    npx --yes @vscode/vsce package || true
  else
    echo "npx not found; attempted global install instead (may fail without root)."
    npm install -g vsce || true
  fi
else
  echo "Packaging extension..."
  vsce package || true
fi

echo "Moving VSIX to repository root (if created)..."
for f in *.vsix; do
  if [ -f "$f" ]; then
    mv -f "$f" ..
    echo "Moved $f to .."
  fi
done

echo "Done. If a VSIX was created, it's in the repository root."
