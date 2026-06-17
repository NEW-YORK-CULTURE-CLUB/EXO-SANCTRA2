#!/usr/bin/env node
/**
 * Merges multiple skins in a GLB into a single skin.
 * Required because usd-from-gltf fails on GLBs with 2+ skins.
 *
 * Usage: node scripts/merge-skins.mjs <input.glb> <output.glb>
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error('Usage: node merge-skins.mjs <input.glb> <output.glb>');
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
console.log(`Reading: ${inputPath}`);
const doc = await io.read(inputPath);
const root = doc.getRoot();

const skins = root.listSkins();
if (skins.length <= 1) {
  console.log('Only 1 skin — nothing to merge, copying as-is.');
  await io.write(outputPath, doc);
  process.exit(0);
}

console.log(`Merging ${skins.length} skins into 1...`);

// Build parent map
const parentMap = new Map();
for (const node of root.listNodes()) {
  for (const child of node.listChildren()) parentMap.set(child, node);
}

// Collect ALL unique joints from all skins, preserving per-skin order first
const allJointsOrdered = [];
const seenJoints = new Set();
for (const skin of skins) {
  for (const j of skin.listJoints()) {
    if (!seenJoints.has(j)) {
      allJointsOrdered.push(j);
      seenJoints.add(j);
    }
  }
}

// Topological sort of ALL joints so parents come before children
const sorted = [];
const visited = new Set();
const jointSet = new Set(allJointsOrdered);

const roots = allJointsOrdered.filter(j => !jointSet.has(parentMap.get(j)));
const queue = [...roots];
while (queue.length > 0) {
  const node = queue.shift();
  if (visited.has(node)) continue;
  visited.add(node);
  if (jointSet.has(node)) sorted.push(node);
  for (const child of node.listChildren()) {
    if (jointSet.has(child) && !visited.has(child)) queue.push(child);
  }
}
// Catch any disconnected joints
for (const j of allJointsOrdered) {
  if (!visited.has(j)) sorted.push(j);
}

console.log(`  Combined unique joints: ${sorted.length}`);

// Build per-skin remapping: old skin-local joint index → new global joint index
const skinRemaps = skins.map(skin => {
  const skinJoints = skin.listJoints();
  return new Map(skinJoints.map((j, i) => [i, sorted.indexOf(j)]));
});

// Update JOINTS_0 / JOINTS_1 on all primitives
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    // Find which skin this primitive uses
    const skinUsers = root.listNodes().filter(n => n.getMesh() === mesh);
    const skinUser = skinUsers.find(n => n.getSkin() !== null);
    if (!skinUser) continue;

    const skin = skinUser.getSkin();
    const skinIdx = skins.indexOf(skin);
    if (skinIdx === -1) continue;
    const remap = skinRemaps[skinIdx];

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

// Build the merged skin: collect IBMs in sorted order
const mergedSkin = doc.createSkin('merged_skin');

// Find skeleton root (common ancestor or just first root joint)
const skeletonRoot = sorted[0];
mergedSkin.setSkeleton(skeletonRoot);

// Add joints and their IBMs
// We need the IBM for each joint — pull from whichever original skin has it
const ibmData = new Float32Array(sorted.length * 16);
ibmData.fill(0);
// Set each entry to identity first
for (let i = 0; i < sorted.length; i++) {
  ibmData[i * 16 + 0] = 1; ibmData[i * 16 + 5] = 1;
  ibmData[i * 16 + 10] = 1; ibmData[i * 16 + 15] = 1;
}

for (const skin of skins) {
  const skinJoints = skin.listJoints();
  const ibm = skin.getInverseBindMatrices();
  if (!ibm) continue;
  const arr = ibm.getArray();
  skinJoints.forEach((j, localIdx) => {
    const globalIdx = sorted.indexOf(j);
    if (globalIdx === -1) return;
    for (let k = 0; k < 16; k++) {
      ibmData[globalIdx * 16 + k] = arr[localIdx * 16 + k];
    }
  });
}

const ibmAccessor = doc.createAccessor('merged_skin_ibm')
  .setType('MAT4')
  .setArray(ibmData);
mergedSkin.setInverseBindMatrices(ibmAccessor);

for (const j of sorted) mergedSkin.addJoint(j);

// Point all nodes that had any old skin to the merged skin
for (const node of root.listNodes()) {
  if (node.getSkin() !== null && skins.includes(node.getSkin())) {
    node.setSkin(mergedSkin);
  }
}

// Dispose old skins
for (const skin of skins) skin.dispose();

console.log(`Writing: ${outputPath}`);
await io.write(outputPath, doc);
console.log('Done.');
