#!/usr/bin/env node
/**
 * Prepares GLB files for import into Reality Composer Pro by stripping
 * Draco compression and other extensions Apple's tools don't support.
 * Outputs to public/vault/AR/for-apple/ — import those GLBs into Reality Composer Pro.
 *
 * Run: node scripts/prepare-glb-for-apple.mjs
 * Requires: npm install --save-dev @gltf-transform/cli
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const vaultAR = join(projectRoot, 'public', 'vault', 'AR');
const outDir = join(vaultAR, 'for-apple');

const glbFiles = [
  'artwork 1_planet of love_character.glb',
  'artwork 2_the unburied ones_character.glb',
  'artwork 4_my freak family_character.glb',
  'artwork 7_liquid desire_character.glb',
  'artwork 8_cleansing rite_character.glb',
  'artwork 10_necroflora_character.glb',
];

// Uses npx @gltf-transform/cli (no local install required)

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

console.log('Preparing GLB files for Reality Composer Pro (stripping Draco/compression)...\n');

for (const file of glbFiles) {
  const input = join(vaultAR, file);
  const output = join(outDir, file);
  if (!existsSync(input)) {
    console.warn('  Skip (not found):', file);
    continue;
  }
  try {
    execSync(`npx @gltf-transform/cli copy "${input}" "${output}"`, {
      stdio: 'inherit',
      cwd: projectRoot,
    });
    console.log('  OK:', file);
  } catch (err) {
    console.error('  Failed:', file, err.message);
  }
}

console.log('\nDone. Import the GLBs from: public/vault/AR/for-apple/');
console.log('Then in Reality Composer Pro: File → Export → USDZ, and save into public/vault/AR/ with the same base name.');
