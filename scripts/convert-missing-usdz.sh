#!/usr/bin/env bash
# Converts GLBs that don't have a USDZ yet → for iOS AR Quick Look support.
# Automatically skips files that already have a USDZ.
# Requires: Docker Desktop running.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
VAULT_AR="$PWD/public/vault/AR"

if ! command -v docker &>/dev/null; then
  echo "Docker not found. Install Docker Desktop:"
  echo "  brew reinstall --cask docker-desktop"
  echo "Then open Docker Desktop and run this script again."
  exit 1
fi

if ! docker info &>/dev/null 2>&1; then
  echo "Docker is installed but not running. Open Docker Desktop and wait for it to start, then re-run."
  exit 1
fi

glb_files=(
  "artwork 1_planet of love_character.glb"
  "artwork 2_the unburied ones_character.glb"
  "artwork 3_ugly is beautiful_character.glb"
  "artwork 4_my freak family_character.glb"
  "artwork 5_exorcise me whole_character.glb"
  "artwork 6_homebound galaxy_character.glb"
  "artwork 7_liquid desire_character.glb"
  "artwork 8_cleansing rite_character.glb"
  "artwork 9_taste the power_character.glb"
  "artwork 10_necroflora_character.glb"
  "artwork 11_let go_character.glb"
)

missing=0
skipped=0
failed=0

for f in "${glb_files[@]}"; do
  out_name="${f%.glb}.usdz"
  if [[ -f "$VAULT_AR/$out_name" ]]; then
    echo "  Skip (already exists): $out_name"
    skipped=$((skipped + 1))
    continue
  fi
  if [[ ! -f "$VAULT_AR/$f" ]]; then
    echo "  Skip (GLB not found): $f"
    continue
  fi
  echo "  Converting: $f → $out_name"
  if docker run --rm -v "$VAULT_AR:/usr/app" marlon360/usd-from-gltf:latest "$f" "$out_name"; then
    echo "    OK"
  else
    echo "    FAILED: $f"
    failed=$((failed + 1))
  fi
done

echo ""
echo "Done. Skipped: $skipped | Failed: $failed"
echo "USDZ files are in: public/vault/AR/"
