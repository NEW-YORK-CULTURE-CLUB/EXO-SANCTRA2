#!/usr/bin/env bash
# Convert GLB files in public/vault/AR/ to USDZ for iOS Quick Look.
# Requires one of: Docker, Apple USDPython (usdzconvert), or use README-AR.md for other options.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
VAULT_AR="$PWD/public/vault/AR"

glb_files=(
  "artwork 1_planet of love_character.glb"
  "artwork 2_the unburied ones_character.glb"
  "artwork 4_my freak family_character.glb"
  "artwork 7_liquid desire_character.glb"
  "artwork 8_cleansing rite_character.glb"
  "artwork 10_necroflora_character.glb"
)

if command -v docker &>/dev/null; then
  echo "Using Docker to convert GLB → USDZ..."
  for f in "${glb_files[@]}"; do
    in="$VAULT_AR/$f"
    out="$VAULT_AR/${f%.glb}.usdz"
    if [[ -f "$in" ]]; then
      echo "  $f"
      docker run --rm -v "$VAULT_AR:/usr/app" marlon360/usd-from-gltf:latest "$f" "$(basename "$out")" || \
      { echo "    Run: docker pull marlon360/usd-from-gltf"; exit 1; }
    fi
  done
  echo "Done. USDZ files are in public/vault/AR/"
  exit 0
fi

if command -v usdzconvert &>/dev/null; then
  echo "Using usdzconvert (Apple USDPython)..."
  for f in "${glb_files[@]}"; do
    in="$VAULT_AR/$f"
    out="$VAULT_AR/${f%.glb}.usdz"
    if [[ -f "$in" ]]; then
      echo "  $f"
      usdzconvert "$in" "$out"
    fi
  done
  echo "Done. USDZ files are in public/vault/AR/"
  exit 0
fi

echo "No converter found. Options:"
echo ""
echo "1) Docker (recommended for CLI):"
echo "   Install Docker Desktop or: brew install docker"
echo "   docker pull marlon360/usd-from-gltf"
echo "   Then run this script again."
echo ""
echo "2) Apple tools (Xcode / iOS):"
echo "   Reality Composer Pro is in Xcode (Mac App Store)."
echo "   Reality Composer is on the App Store for iPhone/iPad."
echo "   See: https://developer.apple.com/augmented-reality/tools/"
echo ""
echo "3) Free online: usdz.io or converter.pausarstudio.de — upload GLB, download USDZ, save here with same name."
echo ""
echo "4) Apple USDPython (usdzconvert):"
echo "   If you have Apple's USD Python package, add usdzconvert to PATH and run this script again."
echo ""
echo "Full list and names: see public/vault/AR/README-AR.md"
echo ""
echo "Files to convert (same base name → .usdz):"
for f in "${glb_files[@]}"; do
  echo "  $f → ${f%.glb}.usdz"
done
exit 1
