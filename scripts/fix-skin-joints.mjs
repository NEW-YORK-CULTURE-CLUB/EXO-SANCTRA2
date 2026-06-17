#!/usr/bin/env node
/**
 * Fixes GLB skin joint ordering so parent joints always come before children.
 * Required because usd-from-gltf (ufg) asserts parent_joint_index < child_joint_index.
 *
 * Usage: node scripts/fix-skin-joints.mjs <input.glb> <output.glb>
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error('Usage: node fix-skin-joints.mjs <input.glb> <output.glb>');
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
console.log(`Reading: ${inputPath}`);
const doc = await io.read(inputPath);
const root = doc.getRoot();

// Build parent map across all nodes
const parentMap = new Map();
for (const node of root.listNodes()) {
  for (const child of node.listChildren()) {
    parentMap.set(child, node);
  }
}

let fixed = 0;

for (const skin of root.listSkins()) {
  const joints = skin.listJoints();
  if (joints.length === 0) continue;

  const jointSet = new Set(joints);

  // Topological sort via BFS: roots first, then children
  const sorted = [];
  const visited = new Set();

  const roots = joints.filter(j => !jointSet.has(parentMap.get(j)));
  const queue = [...roots];

  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (jointSet.has(node)) sorted.push(node);
    for (const child of node.listChildren()) {
      if (jointSet.has(child) && !visited.has(child)) {
        queue.push(child);
      }
    }
  }

  // Add any joints not reachable via BFS (disconnected)
  for (const j of joints) {
    if (!visited.has(j)) sorted.push(j);
  }

  // Build remapping: old index → new index
  const remap = new Map(joints.map((j, i) => [i, sorted.indexOf(j)]));

  const unchanged = joints.every((j, i) => sorted[i] === j);
  if (unchanged) {
    console.log(`  Skin "${skin.getName()}": already correct order, skipping`);
    continue;
  }

  console.log(`  Skin "${skin.getName()}": reordering ${joints.length} joints`);
  fixed++;

  // Reorder inverse bind matrices
  const ibm = skin.getInverseBindMatrices();
  if (ibm) {
    const arr = ibm.getArray();
    const newArr = new arr.constructor(arr.length);
    for (const [oldIdx, newIdx] of remap) {
      for (let k = 0; k < 16; k++) {
        newArr[newIdx * 16 + k] = arr[oldIdx * 16 + k];
      }
    }
    ibm.setArray(newArr);
  }

  // Update JOINTS_0 (and JOINTS_1 if present) in all primitives
  for (const mesh of root.listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      for (const attr of ['JOINTS_0', 'JOINTS_1']) {
        const accessor = prim.getAttribute(attr);
        if (!accessor) continue;
        const arr = accessor.getArray();
        const newArr = new arr.constructor(arr.length);
        for (let i = 0; i < arr.length; i += 4) {
          for (let j = 0; j < 4; j++) {
            const oldIdx = arr[i + j];
            newArr[i + j] = remap.has(oldIdx) ? remap.get(oldIdx) : oldIdx;
          }
        }
        accessor.setArray(newArr);
      }
    }
  }

  // Update skin joint list: remove all then re-add in sorted order
  for (const j of [...joints]) skin.removeJoint(j);
  for (const j of sorted) skin.addJoint(j);
}

console.log(`Writing: ${outputPath} (${fixed} skin(s) fixed)`);
await io.write(outputPath, doc);
console.log('Done.');
