#!/usr/bin/env node
/**
 * ORGCHART PIPELINE — Tree-Based Deduplication
 * Properly removes pipeline-generated duplicates by operating on the parsed tree,
 * then serializing back to data.js.
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_JS = resolve(__dirname, '..', 'js', 'data.js');

// Read and parse data.js
const content = readFileSync(DATA_JS, 'utf-8');
const match = content.match(/const\s+ORG_DATA\s*=\s*(\{[\s\S]*\})\s*;\s*$/);
if (!match) { console.error('Could not find ORG_DATA'); process.exit(1); }

const evaluator = new Function(`return ${match[1]};`);
const orgData = evaluator();

// Collect all nodes with paths
function flattenTree(node, parent = null, path = []) {
  const result = [];
  const entry = { node, parent, path: [...path, node.id] };
  result.push(entry);
  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenTree(child, node, entry.path));
    }
  }
  return result;
}

const allNodes = flattenTree(orgData);
console.log(`Total nodes: ${allNodes.length}`);

// Identify pipeline vs original
const pipelineNodes = allNodes.filter(e => 
  e.node.metadata?.custom?.pipelineGenerated === true
);
const originalNodes = allNodes.filter(e => 
  !e.node.metadata?.custom?.pipelineGenerated
);

console.log(`Pipeline: ${pipelineNodes.length}, Original: ${originalNodes.length}`);

// Name matching helpers
function normName(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*/i, '')
    .replace(/,?\s*(Ph\.?D\.?|Ed\.?D\.?|M\.?D\.?|J\.?D\.?|MBA|M\.?S\.?|M\.?A\.?|B\.?S\.?)/gi, '')
    .replace(/\s+/g, ' ').trim();
}

function getLastName(name) {
  const parts = normName(name).split(/\s+/);
  return parts[parts.length - 1].toLowerCase().replace(/[^a-z]/g, '');
}

function getFirstInitial(name) {
  return normName(name).split(/\s+/)[0][0].toLowerCase();
}

function getFirstName(name) {
  return normName(name).split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
}

function getParentPrefix(id) {
  return id.replace(/-[^-]+$/, '');
}

// Find duplicates
const toRemoveIds = new Set();
const removals = [];

for (const p of pipelineNodes) {
  const pName = p.node.holder?.name || '';
  if (!pName) continue;
  
  const pLast = getLastName(pName);
  const pFirst = getFirstName(pName);
  const pInitial = getFirstInitial(pName);
  const pParent = getParentPrefix(p.node.id);

  for (const o of originalNodes) {
    const oName = o.node.holder?.name || '';
    if (!oName) continue;

    const oLast = getLastName(oName);
    if (pLast !== oLast || pLast.length < 3) continue;

    const oFirst = getFirstName(oName);
    const oInitial = getFirstInitial(oName);
    const oParent = getParentPrefix(o.node.id);

    // Same department tree
    const sameDept = pParent.includes(oParent) || oParent.includes(pParent) || p.node.department === o.node.department;
    if (!sameDept) continue;

    // Name match: first initial or first 3 chars
    const firstMatch = pInitial === oInitial 
      || pFirst.substring(0, 3) === oFirst.substring(0, 3)
      || oFirst.startsWith(pFirst.substring(0, 3));
    if (!firstMatch) continue;

    toRemoveIds.add(p.node.id);
    removals.push({
      removeId: p.node.id,
      removeName: pName,
      keepId: o.node.id,
      keepName: oName
    });
    break;
  }
}

console.log(`\nDuplicates to remove: ${toRemoveIds.size}`);
console.log('─'.repeat(50));
removals.forEach(r => {
  console.log(`  ✖ REMOVE: ${r.removeId} | ${r.removeName}`);
  console.log(`  ✔ KEEP:   ${r.keepId} | ${r.keepName}`);
  console.log('');
});

if (toRemoveIds.size === 0) {
  console.log('No duplicates found!');
  process.exit(0);
}

// Remove nodes from the tree
function removeFromTree(node) {
  if (node.children) {
    node.children = node.children.filter(child => {
      if (toRemoveIds.has(child.id)) return false;
      removeFromTree(child);
      return true;
    });
  }
}

removeFromTree(orgData);

// Verify the cleaned tree
const afterNodes = flattenTree(orgData);
console.log(`\nBefore: ${allNodes.length} nodes → After: ${afterNodes.length} nodes`);

// Backup
const backupPath = DATA_JS + `.backup-dedup2-${Date.now()}`;
copyFileSync(DATA_JS, backupPath);
console.log(`Backup: ${backupPath}`);

// Serialize back to data.js
// We need to preserve the file's header/comments and just replace ORG_DATA
const preContent = content.substring(0, match.index);

function serializeNode(node, indent = 2) {
  const pad = ' '.repeat(indent);
  const holderName = (node.holder?.name || '').replace(/'/g, "\\'");
  const title = (node.title || '').replace(/'/g, "\\'");
  const dept = (node.department || '').replace(/'/g, "\\'");
  const div = (node.division || '').replace(/'/g, "\\'");
  const since = node.holder?.since || '';
  const photo = node.holder?.photo ? `'${node.holder.photo}'` : 'null';
  
  const meta = node.metadata || {};
  const quals = JSON.stringify(meta.qualifications || []);
  const comps = JSON.stringify(meta.competencies || []);
  const nec = (meta.necessity || '').replace(/'/g, "\\'");
  const sb = (meta.salaryBand || '').replace(/'/g, "\\'");
  
  const custom = meta.custom || {};
  const customParts = [];
  for (const [k, v] of Object.entries(custom)) {
    if (typeof v === 'string') customParts.push(`${k}: '${v.replace(/'/g, "\\'")}'`);
    else if (typeof v === 'boolean') customParts.push(`${k}: ${v}`);
    else if (typeof v === 'number') customParts.push(`${k}: ${v}`);
  }
  const customStr = customParts.length > 0 ? `{ ${customParts.join(', ')} }` : '{}';

  let line = `${pad}{ id: '${node.id}', title: '${title}', department: '${dept}', division: '${div}', `;
  line += `holder: { name: '${holderName}', since: '${since}', photo: ${photo} }, `;
  line += `status: '${node.status || 'filled'}', level: ${node.level || 5}, `;
  line += `metadata: { qualifications: ${quals}, competencies: ${comps}, `;
  line += `necessity: '${nec}', salaryBand: '${sb}', `;
  line += `salary: ${meta.salary || 0}, salaryYear: ${meta.salaryYear || 2025}, `;
  line += `directReports: ${meta.directReports || 0}, teamSize: ${meta.teamSize || 1}, `;
  line += `classification: '${meta.classification || 'EPA'}', custom: ${customStr} }, `;
  
  if (!node.children || node.children.length === 0) {
    line += `children: [] }`;
  } else {
    line += `children: [\n`;
    node.children.forEach((child, i) => {
      line += serializeNode(child, indent + 2);
      if (i < node.children.length - 1) line += ',';
      line += '\n';
    });
    line += `${pad}] }`;
  }
  
  return line;
}

const newOrgData = `const ORG_DATA = ${serializeNode(orgData, 0)};\n`;
writeFileSync(DATA_JS, preContent + newOrgData, 'utf-8');
console.log(`\n✅ Saved cleaned data.js with ${afterNodes.length} nodes`);
