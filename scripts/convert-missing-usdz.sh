#!/usr/bin/env bash
# Converts only the GLBs that don't have a USDZ yet. Run from project root.
# Requires: Docker running, and npm run ar:prepare-glb already done.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
VAULT_AR="$PWD/public/vault/AR"
FOR_APPLE="$VAULT_AR/for-apple"

glb_files=(
  "artwork 1_planet of love_character.glb"
  "artwork 2_the unburied ones_character.glb"
  "artwork 4_my freak family_character.glb"
  "artwork 7_liquid desire_character.glb"
  "artwork 8_cleansing rite_character.glb"
  "artwork 10_necroflora_character.glb"
)

missing=0
for f in "${glb_files[@]}"; do
  out_name="${f%.glb}.usdz"
  if [[ -f "$FOR_APPLE/$f" && ! -f "$VAULT_AR/$out_name" ]]; then
    echo "Converting: $f → $out_name"
    if docker run --rm -v "$VAULT_AR:/usr/app" marlon360/usd-from-gltf:latest "for-apple/$f" "$out_name"; then
      echo "  OK"
    else
      echo "  FAILED"
      missing=$((missing + 1))
    fi
  fi
done

if [[ $missing -eq 0 ]]; then
  echo "Done. All USDZ files are in public/vault/AR/"
else
  echo "Some conversions failed. Re-run when Docker is ready or try the online converter for those files."
fi
