#!/usr/bin/env bash
# Converts the GLBs in public/vault/AR/for-apple/ to USDZ in public/vault/AR/.
# Run after: npm run ar:prepare-glb
# Requires: Docker (docker pull marlon360/usd-from-gltf)

set -e
# Don't exit on first failed conversion so remaining files still run
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
VAULT_AR="$PWD/public/vault/AR"
FOR_APPLE="$VAULT_AR/for-apple"

if [[ ! -d "$FOR_APPLE" ]]; then
  echo "Run first: npm run ar:prepare-glb"
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "Docker is required. Install Docker Desktop or run: brew install docker"
  exit 1
fi

glb_files=(
  "artwork 1_planet of love_character.glb"
  "artwork 2_the unburied ones_character.glb"
  "artwork 4_my freak family_character.glb"
  "artwork 7_liquid desire_character.glb"
  "artwork 8_cleansing rite_character.glb"
  "artwork 10_necroflora_character.glb"
)

echo "Converting for-apple GLBs → USDZ in public/vault/AR/..."
for f in "${glb_files[@]}"; do
  in="$FOR_APPLE/$f"
  out_name="${f%.glb}.usdz"
  if [[ -f "$in" ]]; then
    if [[ -f "$VAULT_AR/$out_name" ]]; then
      echo "  Skip (already exists): $out_name"
    else
      echo "  $f → $out_name"
      if ! docker run --rm -v "$VAULT_AR:/usr/app" marlon360/usd-from-gltf:latest "for-apple/$f" "$out_name"; then
        echo "  FAILED: $f"
      fi
    fi
  else
    echo "  Skip (not found): $f"
  fi
done
echo "Done. USDZ files are in public/vault/AR/"
