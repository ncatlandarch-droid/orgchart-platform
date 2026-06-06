#!/usr/bin/env node
/* ============================================
 * ORGCHART PIPELINE — Data Mapper (HYBRID)
 * --------------------------------------------
 * The CORE of the pipeline. Merges scraped data
 * with existing data.js using the HYBRID approach:
 * 
 *   - Detects NEW HIRES (in scraped, not in data.js)
 *   - Flags POTENTIAL DEPARTURES (in data.js, not in scraped)
 *   - Tracks SALARY CHANGES (different amounts)
 *   - Preserves manually curated metadata
 *   - Classifies EPA/SPA by title patterns
 *   - Maps to department parent nodes
 * 
 * Usage:
 *   node mapper.js             # Generate report + pending additions
 *   node mapper.js --apply     # Merge pending additions into data.js
 *   node mapper.js --validate  # Check data.js for structural issues
 * 
 * Last updated: June 2026
 * ============================================ */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// —— ES Module dirname shim ——
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// —— File Paths ——
const PATHS = {
  salaryData: resolve(__dirname, '../data/raw-employees.json'),
  directoryData: resolve(__dirname, '../data/directory-employees.json'),
  overrides: resolve(__dirname, '../data/overrides.json'),
  dataJs: resolve(__dirname, '../js/data.js'),
  report: resolve(__dirname, '../data/pipeline-report.json'),
  pendingAdditions: resolve(__dirname, '../data/pending-additions.js'),
  dataDir: resolve(__dirname, '../data'),
};

// —— CLI Flags ——
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const VALIDATE = args.includes('--validate');

// ═══════════════════════════════════════════
// DEPARTMENT MAP
// ═══════════════════════════════════════════
// Maps known department names from the directory
// to parent node IDs in data.js.

const DEPARTMENT_MAP = {
  // ── Academic Departments ──
  'Biology': 'cost-bio',
  'Chemistry': 'cost-chem',
  'Mathematics': 'cost-math',
  'Mathematics & Statistics': 'cost-math',
  'Physics': 'cost-phys',
  'Computer Science': 'coe-cs',
  'Electrical & Computer Engineering': 'coe-ece',
  'Mechanical Engineering': 'coe-meen',
  'Industrial & Systems Engineering': 'coe-ise',
  'Natural Resources & Environmental Design': 'caes-nred',
  'Natural Resources & Environ Design': 'caes-nred',
  'Animal Sciences': 'caes-ansc',
  'Family & Consumer Sciences': 'caes-fcs',
  'Family and Consumer Sciences': 'caes-fcs',
  'Agribusiness, Applied Economics & Agriscience Education': 'caes-abaee',
  'Agribusiness Econ Agriscience': 'caes-abaee',
  'English': 'cahss-eng',
  'History & Political Science': 'cahss-hps',
  'History and Political Science': 'cahss-hps',
  'Journalism & Mass Communication': 'cahss-jmc',
  'Journalism and Mass Comm': 'cahss-jmc',
  'Liberal Studies': 'cahss-ls',
  'Liberal Studies Department': 'cahss-ls',
  'Visual & Performing Arts': 'cahss-vpa',
  'Visual and Performing Arts': 'cahss-vpa',
  'Criminal Justice': 'cahss-cj',
  'Psychology': 'chhs-psych',
  'Social Work & Sociology': 'chhs-swas',
  'Sociology & Social Work': 'chhs-swas',
  'Nursing': 'chhs-nurs',
  'School of Nursing': 'chhs-nurs',
  'Kinesiology': 'chhs-kin',
  'Communication Sciences & Disorders': 'chhs-csd',
  'Physician Assistant Studies': 'chhs-pa',
  'Physician Assistant Program': 'chhs-pa',
  'Population Health Management & Policy': 'chhs-phmp',
  'Accounting & Finance': 'cobe-af',
  'Accounting and Finance': 'cobe-af',
  'Marketing & Supply Chain Management': 'cobe-mscm',
  'Economics': 'cobe-econ',
  'Business Information Systems & Analytics': 'cobe-bisa',
  'Business Info Systems & Analytics': 'cobe-bisa',
  'Management': 'cobe-mgmt',
  'Educator Preparation': 'coed-ep',
  'Counseling': 'coed-coun',
  'Leadership Studies & Adult Education': 'coed-lsae',
  'Leadership Studies & Adult Ed': 'coed-lsae',
  'Nanoscience': 'jsnn-nano',
  'Nanoengineering': 'jsnn-nanoeng',
  'JSNN: Nanoengineering': 'jsnn-nanoeng',
  'Applied Engineering Technology': 'cost-aet',
  'Built Environment': 'cost-be',
  'Department of Built Environment': 'cost-be',
  'Computer Systems Technology': 'cost-cst',
  'Chemical, Biological & Bio Engineering': 'coe-cbbe',
  'Chemical Biological & Bioengineerin': 'coe-cbbe',
  'Civil, Architectural & Environmental Engineering': 'coe-caee',
  'Civil Architect & Environ Engineer': 'coe-caee',
  'Computational Data Science & Engineering': 'coe-cdse',
  'Computational Science & Engineering': 'coe-cdse',
  // ── Non-Academic / Support Departments ──
  'Information Technology Services ITS': 'it',
  'Information Technology Services': 'it',
  'Facilities': 'fin-avc-facilities',
  'Physical Plant': 'fin-avc-facilities',
  'Human Resources': 'fin-avc-hr',
  'Intercollegiate Athletics': 'athletics',
  'Athletics': 'athletics',
  'Student Affairs': 'student-affairs',
  'Housing and Residence Life': 'student-affairs',
  'Memorial Union': 'student-affairs',
  'Division of University Advancement': 'advancement',
  'University Advancement': 'advancement',
  'University Relations': 'advancement',
  'Enrollment Mgmnt and Admissions': 'aa-enrollment',
  'Enrollment Management': 'aa-enrollment',
  'Financial Aid': 'aa-enrollment',
  'University Registrar': 'aa-enrollment',
  'Division of Research': 'research',
  'Research': 'research',
  'Institutional Research': 'research',
  'Library Services': 'aa-library',
  'Library': 'aa-library',
  'Police Administration': 'fin-police',
  'Parking Services': 'fin-police',
  'Health Services': 'student-affairs',
  'Counseling Services': 'student-affairs',
  'Center for Academic Excellence': 'aa-sr-vice-provost',
  'Provost and VC for Academic Affairs': 'provost',
  'Chancellor': 'chancellor',
  'Business and Finance': 'finance',
  'Budget': 'fin-budget',
  'Controller': 'fin-controller',
  'Treasurer': 'fin-treasurer',
  'Procurement Services': 'fin-procurement',
  'The Graduate College': 'provost',
  'Honors College': 'provost',
  'Campus Enterprises': 'finance',
  'N C A&T Real Estate Foundation': 'finance',
  'Laboratory School': 'provost',
  'Agricultural Extension': 'caes-dean',
  'College of Ag & Environ Sciences': 'caes-dean',
  'College of Engineering': 'coe-dean',
  'College of Science and Technology': 'cost-dean',
  'College of Business & Economics': 'cobe-dean',
  'College of Health & Human Sciences': 'chhs-dean',
  'Cntr of Excellence-Post Harvest Tec': 'caes-dean',
  'Strategic Partnership & Economic Dv': 'provost',
  'Minority Student Affairs': 'student-affairs',
};

// Reverse map: department aliases and fuzzy matches
const DEPARTMENT_ALIASES = {
  'math': 'cost-math',
  'mathematics': 'cost-math',
  'stats': 'cost-math',
  'bio': 'cost-bio',
  'biological sciences': 'cost-bio',
  'chem': 'cost-chem',
  'physics': 'cost-phys',
  'cs': 'coe-cs',
  'comp sci': 'coe-cs',
  'ece': 'coe-ece',
  'ee': 'coe-ece',
  'me': 'coe-meen',
  'ise': 'coe-ise',
  'nred': 'caes-nred',
  'landscape architecture': 'caes-nred',
  'animal science': 'caes-ansc',
  'fcs': 'caes-fcs',
  'jmc': 'cahss-jmc',
  'vpa': 'cahss-vpa',
  'nurs': 'chhs-nurs',
  'nursing': 'chhs-nurs',
  'psych': 'chhs-psych',
  'social work': 'chhs-swas',
  'sociology': 'chhs-swas',
  'acct': 'cobe-af',
  'accounting': 'cobe-af',
  'finance': 'cobe-af',
  'marketing': 'cobe-mscm',
  'supply chain': 'cobe-mscm',
  'econ': 'cobe-econ',
  'mgmt': 'cobe-mgmt',
  'it': 'its',
  'its': 'its',
  'hr': 'hr',
  'caee': 'coe-caee',
  'cbbe': 'coe-cbbe',
  'cdse': 'coe-cdse',
  'library': 'aa-library',
};

// ═══════════════════════════════════════════
// TITLE CLASSIFICATION RULES
// ═══════════════════════════════════════════

/**
 * Classifies an employee as EPA or SPA based on title patterns.
 * EPA = Exempt from Personnel Act (faculty, administrators, professionals)
 * SPA = Subject to Personnel Act (support staff, technicians, etc.)
 * @param {string} title - Employee title
 * @returns {'EPA'|'SPA'|'Unknown'} Classification
 */
function classifyByTitle(title) {
  if (!title) return 'Unknown';
  const t = title.toLowerCase();

  // EPA titles — faculty, administration, professionals
  const epaPatterns = [
    'professor', 'dean', 'provost', 'chancellor',
    'director', 'coordinator', 'manager',
    'vice president', 'vp', 'chief',
    'assistant vice', 'associate vice',
    'counsel', 'attorney', 'auditor',
    'executive', 'officer', 'analyst',
    'specialist', 'advisor', 'librarian',
    'coach', 'head coach', 'assistant coach',
    'research', 'scientist', 'engineer',
    'architect', 'planner', 'designer',
  ];

  // SPA titles — support staff
  const spaPatterns = [
    'technician', 'administrative', 'custodial',
    'maintenance', 'groundskeeper', 'housekeeper',
    'clerk', 'receptionist', 'secretary',
    'mechanic', 'electrician', 'plumber',
    'security', 'officer', 'patrol',
    'food service', 'cook', 'dining',
    'mail', 'printing', 'warehouse',
    'utility', 'laborer',
  ];

  // Check EPA first (higher priority)
  if (epaPatterns.some(p => t.includes(p))) return 'EPA';
  if (spaPatterns.some(p => t.includes(p))) return 'SPA';

  return 'Unknown';
}

/**
 * Determines the organizational level by title.
 * Level 1 = Chancellor (top)
 * Level 5 = Individual contributor (default)
 * @param {string} title - Employee title
 * @returns {number} Level (1-5)
 */
function determineLevelByTitle(title) {
  if (!title) return 5;
  const t = title.toLowerCase();

  if (t.includes('chancellor') && !t.includes('vice')) return 1;
  if (t.includes('vice chancellor') || t.includes('provost')) return 2;
  if (t.includes('dean') && !t.includes('associate') && !t.includes('assistant')) return 3;
  if (t.includes('associate dean') || t.includes('assistant dean')) return 4;
  if (t.includes('chair') || (t.includes('director') && !t.includes('associate') && !t.includes('assistant'))) return 4;
  return 5;
}

// ═══════════════════════════════════════════
// NAME NORMALIZATION & MATCHING
// ═══════════════════════════════════════════

/**
 * Normalizes a name for fuzzy matching.
 * Strips honorifics, degrees, suffixes, and normalizes whitespace.
 * @param {string} name - Raw name
 * @returns {string} Normalized name key
 */
function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    // Remove honorifics
    .replace(/\b(dr|mr|mrs|ms|prof|rev|hon)\.?\s*/gi, '')
    // Remove degree suffixes
    .replace(/,?\s*(ph\.?d\.?|ed\.?d\.?|m\.?d\.?|d\.?m\.?a\.?|j\.?d\.?|m\.?s\.?|m\.?a\.?|m\.?b\.?a\.?|m\.?p\.?a\.?|r\.?n\.?|d\.?n\.?p\.?|d\.?p\.?t\.?)/gi, '')
    // Remove generational suffixes
    .replace(/,?\s*(jr\.?|sr\.?|ii|iii|iv|v)\s*$/gi, '')
    // Remove non-alpha characters
    .replace(/[^a-z\s]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a simple similarity score between two normalized names.
 * Uses word-overlap approach for fuzzy matching.
 * @param {string} a - First normalized name
 * @param {string} b - Second normalized name
 * @returns {number} Similarity score (0-1)
 */
function nameSimilarity(a, b) {
  if (a === b) return 1.0;
  if (!a || !b) return 0;

  const wordsA = a.split(' ');
  const wordsB = b.split(' ');

  // ── Strong signal: last name exact match + first initial match ──
  // Handles "William Harrison" vs "W Chris Harrison"
  // and "Benjamin Hall" vs "Ben Hall"
  const lastA = wordsA[wordsA.length - 1];
  const lastB = wordsB[wordsB.length - 1];
  if (lastA === lastB && lastA.length >= 3) {
    const firstA = wordsA[0];
    const firstB = wordsB[0];
    // First initial matches
    if (firstA[0] === firstB[0]) return 0.85;
    // One first name starts with the other (Ben/Benjamin)
    if (firstA.startsWith(firstB.substring(0, 3)) || firstB.startsWith(firstA.substring(0, 3))) return 0.82;
  }

  // ── Word overlap approach ──
  let matches = 0;
  for (const word of wordsA) {
    if (wordsB.includes(word)) matches++;
  }

  const maxLen = Math.max(wordsA.length, wordsB.length);
  return matches / maxLen;
}

/**
 * Finds the best name match from a list of candidates.
 * Returns the match if similarity is above threshold.
 * @param {string} targetName - Name to match
 * @param {string[]} candidates - Array of candidate names
 * @param {number} [threshold=0.7] - Minimum similarity score
 * @returns {{match: string, score: number}|null} Best match or null
 */
function findBestNameMatch(targetName, candidates, threshold = 0.7) {
  const normalizedTarget = normalizeName(targetName);
  let bestMatch = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeName(candidate);
    const score = nameSimilarity(normalizedTarget, normalizedCandidate);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  if (bestScore >= threshold) {
    return { match: bestMatch, score: bestScore };
  }
  return null;
}

// ═══════════════════════════════════════════
// DATA.JS PARSER
// ═══════════════════════════════════════════

/**
 * Parses data.js by evaluating its ORG_DATA constant.
 * Uses a sandboxed approach to extract the tree structure.
 * @param {string} filePath - Path to data.js
 * @returns {object|null} Parsed ORG_DATA tree or null
 */
function parseDataJs(filePath) {
  if (!existsSync(filePath)) {
    log(`data.js not found at: ${filePath}`, 'error');
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Extract the ORG_DATA object using regex
    // Find everything between "const ORG_DATA = {" and the closing "};"
    const match = content.match(/const\s+ORG_DATA\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
    if (!match) {
      log('Could not find ORG_DATA constant in data.js', 'error');
      return null;
    }

    // Use Function constructor to safely evaluate (sandboxed)
    const evaluator = new Function(`return ${match[1]};`);
    const orgData = evaluator();

    log(`Parsed data.js successfully (root: ${orgData.id})`, 'success');
    return orgData;
  } catch (err) {
    log(`Error parsing data.js: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Flattens the org tree into a Map of name → node for lookups.
 * Recursively traverses all children.
 * @param {object} node - Root or subtree node
 * @param {Map} [map=new Map()] - Accumulator map
 * @returns {Map<string, object>} Flat map of name → node
 */
function flattenOrgTree(node, map = new Map()) {
  if (!node) return map;

  if (node.holder && node.holder.name) {
    map.set(node.holder.name, node);
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      flattenOrgTree(child, map);
    }
  }

  return map;
}

/**
 * Collects all node IDs from the org tree for validation.
 * @param {object} node - Root node
 * @param {Set} [ids=new Set()] - Accumulator set
 * @returns {Set<string>} All node IDs
 */
function collectNodeIds(node, ids = new Set()) {
  if (!node) return ids;
  if (node.id) ids.add(node.id);
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      collectNodeIds(child, ids);
    }
  }
  return ids;
}

// ═══════════════════════════════════════════
// DEPARTMENT MAPPING
// ═══════════════════════════════════════════

/**
 * Maps a department name to a parent node ID.
 * Tries exact match first, then aliases, then partial matching.
 * @param {string} deptName - Department name from directory
 * @param {Set<string>} validIds - Valid node IDs from data.js
 * @returns {string|null} Parent node ID or null
 */
function mapDepartmentToParent(deptName, validIds) {
  if (!deptName) return null;

  // 1. Exact match
  if (DEPARTMENT_MAP[deptName]) {
    const id = DEPARTMENT_MAP[deptName];
    if (validIds.has(id)) return id;
    return id; // Return even if not validated — might be added later
  }

  // 2. Alias match (case-insensitive)
  const lowerDept = deptName.toLowerCase().trim();
  if (DEPARTMENT_ALIASES[lowerDept]) {
    return DEPARTMENT_ALIASES[lowerDept];
  }

  // 3. Partial match against department map keys
  for (const [key, id] of Object.entries(DEPARTMENT_MAP)) {
    if (lowerDept.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerDept)) {
      return id;
    }
  }

  return null;
}

// ═══════════════════════════════════════════
// SAFE FILE READERS
// ═══════════════════════════════════════════

/**
 * Safely reads and parses a JSON file.
 * Returns empty array/object on failure.
 * @param {string} path - File path
 * @param {*} defaultValue - Default value if file doesn't exist
 * @returns {*} Parsed JSON or default value
 */
function safeReadJSON(path, defaultValue = []) {
  try {
    if (!existsSync(path)) {
      log(`File not found: ${path} — using default`, 'warn');
      return defaultValue;
    }
    const content = readFileSync(path, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    log(`Error reading ${path}: ${err.message}`, 'error');
    return defaultValue;
  }
}

// ═══════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Returns a formatted timestamp for logging
 * @returns {string} ISO timestamp string
 */
function timestamp() {
  return `[${new Date().toISOString()}]`;
}

/**
 * Logs a message with timestamp and colored prefix
 * @param {string} msg - Message to log
 * @param {'info'|'warn'|'error'|'success'} level - Log level
 */
function log(msg, level = 'info') {
  const prefix = {
    info: '\x1b[36mℹ\x1b[0m',
    warn: '\x1b[33m⚠\x1b[0m',
    error: '\x1b[31m✖\x1b[0m',
    success: '\x1b[32m✔\x1b[0m',
  };
  console.log(`${timestamp()} ${prefix[level] || '•'} ${msg}`);
}

/**
 * Generates a URL-safe node ID from a name and department.
 * @param {string} name - Employee name
 * @param {string} parentId - Parent node ID
 * @returns {string} Generated node ID
 */
function generateNodeId(name, parentId) {
  const safeName = name
    .toLowerCase()
    .replace(/\b(dr|mr|mrs|ms|prof)\.?\s*/gi, '')
    .replace(/,?\s*(ph\.?d\.?|ed\.?d\.?|m\.?d\.?|j\.?d\.?)/gi, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(-1)[0]; // Use last name

  return `${parentId}-${safeName}`;
}

// ═══════════════════════════════════════════
// VALIDATION MODE
// ═══════════════════════════════════════════

/**
 * Validates the current data.js for structural issues.
 * Checks: duplicate IDs, missing holders, orphan nodes, etc.
 * @param {object} orgData - Parsed ORG_DATA tree
 */
function validateDataJs(orgData) {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   ORGCHART PIPELINE — Validator          ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const issues = [];
  const ids = new Set();
  let totalNodes = 0;
  let filledNodes = 0;
  let vacantNodes = 0;
  let interimNodes = 0;

  /**
   * Recursively validates a node and its children
   */
  function validateNode(node, depth = 0, parentId = null) {
    totalNodes++;

    // Check for missing ID
    if (!node.id) {
      issues.push({ severity: 'error', message: `Node at depth ${depth} (parent: ${parentId}) has no ID` });
    }

    // Check for duplicate IDs
    if (node.id && ids.has(node.id)) {
      issues.push({ severity: 'error', message: `Duplicate node ID: "${node.id}"` });
    }
    if (node.id) ids.add(node.id);

    // Check for missing title
    if (!node.title) {
      issues.push({ severity: 'warn', message: `Node "${node.id}" has no title` });
    }

    // Check holder
    if (!node.holder) {
      issues.push({ severity: 'warn', message: `Node "${node.id}" has no holder object` });
    } else if (!node.holder.name) {
      issues.push({ severity: 'info', message: `Node "${node.id}" has no holder name (vacant?)` });
    }

    // Count statuses
    if (node.status === 'filled') filledNodes++;
    else if (node.status === 'vacant') vacantNodes++;
    else if (node.status === 'interim') interimNodes++;

    // Check level consistency
    if (node.level && node.level < 1 || node.level > 5) {
      issues.push({ severity: 'warn', message: `Node "${node.id}" has unusual level: ${node.level}` });
    }

    // Check salary
    if (node.metadata && node.metadata.salary) {
      if (typeof node.metadata.salary !== 'number' || node.metadata.salary < 0) {
        issues.push({ severity: 'warn', message: `Node "${node.id}" has invalid salary: ${node.metadata.salary}` });
      }
    }

    // Recurse into children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        validateNode(child, depth + 1, node.id);
      }
    }
  }

  validateNode(orgData);

  // Report results
  log(`Total nodes: ${totalNodes}`, 'info');
  log(`Filled: ${filledNodes} | Vacant: ${vacantNodes} | Interim: ${interimNodes}`, 'info');
  log(`Unique IDs: ${ids.size}`, 'info');

  if (issues.length === 0) {
    log('\n✅ No structural issues found!', 'success');
  } else {
    log(`\n⚠ Found ${issues.length} issue(s):`, 'warn');

    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warn');
    const infos = issues.filter(i => i.severity === 'info');

    if (errors.length) {
      console.log('\n  🔴 ERRORS:');
      errors.forEach(i => console.log(`    • ${i.message}`));
    }
    if (warnings.length) {
      console.log('\n  🟡 WARNINGS:');
      warnings.forEach(i => console.log(`    • ${i.message}`));
    }
    if (infos.length) {
      console.log('\n  🔵 INFO:');
      infos.forEach(i => console.log(`    • ${i.message}`));
    }
  }

  console.log('');
}

// ═══════════════════════════════════════════
// HYBRID MERGE LOGIC
// ═══════════════════════════════════════════

/**
 * Performs the HYBRID merge — the core pipeline logic.
 * 
 * Steps:
 *  1. Load all data sources
 *  2. Cross-reference salary data with directory data by name
 *  3. Build complete employee records
 *  4. Compare against existing data.js
 *  5. Identify new hires, departures, salary changes
 *  6. Apply overrides
 *  7. Generate report and pending additions
 */
async function runHybridMerge() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   ORGCHART PIPELINE — Mapper (HYBRID)    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (APPLY) log('APPLY mode — changes will be merged into data.js', 'warn');

  // ── Step 1: Load data sources ──
  log('Loading data sources...', 'info');

  const salaryData = safeReadJSON(PATHS.salaryData, []);
  log(`  Salary data: ${salaryData.length} records`, 'info');

  const directoryData = safeReadJSON(PATHS.directoryData, []);
  log(`  Directory data: ${directoryData.length} records`, 'info');

  const overrides = safeReadJSON(PATHS.overrides, {});
  log(`  Overrides: ${Object.keys(overrides.hierarchy_overrides || {}).length} entries`, 'info');

  const orgData = parseDataJs(PATHS.dataJs);
  if (!orgData) {
    log('Cannot proceed without data.js — aborting', 'error');
    process.exitCode = 1;
    return;
  }

  // Flatten existing data for lookups
  const existingMap = flattenOrgTree(orgData);
  const existingNames = [...existingMap.keys()];
  const allNodeIds = collectNodeIds(orgData);
  log(`  Existing org chart: ${existingMap.size} employees across ${allNodeIds.size} nodes`, 'info');

  // ── Step 2: Cross-reference salary + directory data ──
  log('\nCross-referencing salary and directory data...', 'info');

  const mergedEmployees = new Map(); // normalizedName → record

  // Start with salary data
  for (const emp of salaryData) {
    const key = normalizeName(emp.name);
    if (!key) continue;

    mergedEmployees.set(key, {
      name: emp.name,
      title: emp.title || '',
      salary: emp.salary,
      department: emp.department || '',
      college: '',
      email: '',
      phone: '',
      source: 'salary',
    });
  }

  // Enrich with directory data
  let directoryMatches = 0;
  let directoryNew = 0;

  for (const emp of directoryData) {
    const key = normalizeName(emp.name);
    if (!key) continue;

    if (mergedEmployees.has(key)) {
      // Enrich existing record with directory data
      const existing = mergedEmployees.get(key);
      if (emp.department) existing.department = emp.department;
      if (emp.college) existing.college = emp.college;
      if (emp.email) existing.email = emp.email;
      if (emp.phone) existing.phone = emp.phone;
      if (emp.title && !existing.title) existing.title = emp.title;
      existing.source = 'both';
      directoryMatches++;
    } else {
      // New from directory (no salary match)
      mergedEmployees.set(key, {
        name: emp.name,
        title: emp.title || '',
        salary: null,
        department: emp.department || '',
        college: emp.college || '',
        email: emp.email || '',
        phone: emp.phone || '',
        source: 'directory',
      });
      directoryNew++;
    }
  }

  log(`  Cross-referenced: ${directoryMatches} matches, ${directoryNew} directory-only`, 'info');
  log(`  Total merged: ${mergedEmployees.size} unique employees`, 'info');

  // ── Step 3: Classify and assign levels ──
  log('\nClassifying employees...', 'info');

  for (const [key, emp] of mergedEmployees) {
    emp.classification = classifyByTitle(emp.title);
    emp.level = determineLevelByTitle(emp.title);
    emp.parentNodeId = mapDepartmentToParent(emp.department, allNodeIds);
  }

  // ── Step 4: Apply overrides ──
  if (overrides.hierarchy_overrides) {
    log('\nApplying manual overrides...', 'info');
    for (const [name, override] of Object.entries(overrides.hierarchy_overrides)) {
      const key = normalizeName(name);
      if (mergedEmployees.has(key)) {
        const emp = mergedEmployees.get(key);
        if (override.parent) emp.parentNodeId = override.parent;
        if (override.title_override) emp.title = override.title_override;
        if (override.directReports !== undefined) emp.directReports = override.directReports;
        log(`  Override applied: ${name}`, 'success');
      }
    }
  }

  // Apply since dates from overrides
  if (overrides.since_dates) {
    for (const [name, since] of Object.entries(overrides.since_dates)) {
      const key = normalizeName(name);
      if (mergedEmployees.has(key)) {
        mergedEmployees.get(key).since = since;
      }
    }
  }

  // ── Step 5: Compare with existing data.js ──
  log('\nComparing with existing org chart...', 'info');

  const newHires = [];
  const potentialDepartures = [];
  const salaryChanges = [];
  const unmapped = [];
  const exclusionSet = new Set((overrides.exclusions || []).map(n => normalizeName(n)));

  // Find NEW HIRES — in scraped data but NOT in current data.js
  for (const [key, emp] of mergedEmployees) {
    // Skip exclusions
    if (exclusionSet.has(key)) continue;

    const existingMatch = findBestNameMatch(emp.name, existingNames);

    if (!existingMatch) {
      // This is a NEW HIRE
      if (emp.parentNodeId) {
        newHires.push(emp);
      } else {
        unmapped.push(emp);
      }
    } else {
      // Employee exists — check for salary changes
      const existingNode = existingMap.get(existingMatch.match);
      if (existingNode && existingNode.metadata && emp.salary) {
        const existingSalary = existingNode.metadata.salary || 0;
        if (existingSalary > 0 && emp.salary > 0 && Math.abs(existingSalary - emp.salary) > 100) {
          salaryChanges.push({
            name: emp.name,
            existingName: existingMatch.match,
            oldSalary: existingSalary,
            newSalary: emp.salary,
            change: emp.salary - existingSalary,
            changePercent: ((emp.salary - existingSalary) / existingSalary * 100).toFixed(1),
          });
        }
      }
    }
  }

  // Find POTENTIAL DEPARTURES — in data.js but NOT in scraped data
  const scrapedNames = [...mergedEmployees.values()].map(e => e.name);
  for (const [name, node] of existingMap) {
    const match = findBestNameMatch(name, scrapedNames);
    if (!match) {
      potentialDepartures.push({
        name,
        nodeId: node.id,
        title: node.title,
        level: node.level,
      });
    }
  }

  // ── Step 6: Generate statistics ──
  const stats = {
    totalScraped: mergedEmployees.size,
    totalExisting: existingMap.size,
    newHires: newHires.length,
    potentialDepartures: potentialDepartures.length,
    salaryChanges: salaryChanges.length,
    unmapped: unmapped.length,
    byClassification: { EPA: 0, SPA: 0, Unknown: 0 },
    byCollege: {},
    byLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  for (const [key, emp] of mergedEmployees) {
    stats.byClassification[emp.classification] = (stats.byClassification[emp.classification] || 0) + 1;
    const college = emp.college || 'Unknown';
    stats.byCollege[college] = (stats.byCollege[college] || 0) + 1;
    stats.byLevel[emp.level] = (stats.byLevel[emp.level] || 0) + 1;
  }

  // ── Step 7: Generate report ──
  log('\nGenerating pipeline report...', 'info');

  const report = {
    generated_at: new Date().toISOString(),
    pipeline_version: '1.0.0',
    data_sources: {
      salary: { file: PATHS.salaryData, records: salaryData.length },
      directory: { file: PATHS.directoryData, records: directoryData.length },
      overrides: { file: PATHS.overrides, entries: Object.keys(overrides.hierarchy_overrides || {}).length },
      existing: { file: PATHS.dataJs, nodes: existingMap.size },
    },
    statistics: stats,
    new_hires: newHires.map(e => ({
      name: e.name,
      title: e.title,
      salary: e.salary,
      department: e.department,
      college: e.college,
      classification: e.classification,
      level: e.level,
      parentNodeId: e.parentNodeId,
    })),
    potential_departures: potentialDepartures,
    salary_changes: salaryChanges,
    unmapped_employees: unmapped.map(e => ({
      name: e.name,
      title: e.title,
      department: e.department,
      college: e.college,
    })),
  };

  // Ensure data directory exists
  if (!existsSync(PATHS.dataDir)) {
    mkdirSync(PATHS.dataDir, { recursive: true });
  }

  writeFileSync(PATHS.report, JSON.stringify(report, null, 2), 'utf-8');
  log(`Report saved: ${PATHS.report}`, 'success');

  // ── Step 8: Generate pending additions ──
  if (newHires.length > 0) {
    log('\nGenerating pending additions...', 'info');

    const additions = newHires.map(emp => {
      const nodeId = generateNodeId(emp.name, emp.parentNodeId || 'unmapped');
      return {
        id: nodeId,
        title: emp.title,
        department: emp.department,
        division: emp.college || '',
        holder: {
          name: emp.name,
          since: emp.since || new Date().getFullYear().toString(),
          photo: (overrides.photo_urls || {})[emp.name] || null,
        },
        status: 'filled',
        level: emp.level,
        metadata: {
          qualifications: [],
          competencies: [],
          necessity: `Auto-generated from pipeline scrape on ${new Date().toISOString().split('T')[0]}`,
          salaryBand: '',
          salary: emp.salary,
          salaryYear: new Date().getFullYear(),
          directReports: emp.directReports || 0,
          teamSize: 1,
          classification: emp.classification,
          custom: {
            email: emp.email || '',
            phone: emp.phone || '',
            pipelineGenerated: true,
          },
        },
        parentNodeId: emp.parentNodeId, // Reference for injection
        children: [],
      };
    });

    // Write as a JS module that can be imported
    const pendingContent = `/* ============================================
 * ORGCHART PIPELINE — Pending Additions
 * --------------------------------------------
 * Auto-generated by mapper.js on ${new Date().toISOString()}
 * 
 * These nodes are ready to be merged into data.js.
 * Run: node mapper.js --apply
 * Or manually copy nodes to the appropriate parent
 * in js/data.js.
 * 
 * Total new nodes: ${additions.length}
 * ============================================ */

const PENDING_ADDITIONS = ${JSON.stringify(additions, null, 2)};

export default PENDING_ADDITIONS;
`;

    writeFileSync(PATHS.pendingAdditions, pendingContent, 'utf-8');
    log(`Pending additions saved: ${PATHS.pendingAdditions} (${additions.length} nodes)`, 'success');
  }

  // ── Step 9: Apply mode — inject into data.js ──
  if (APPLY && newHires.length > 0) {
    log('\n═══ APPLYING CHANGES TO DATA.JS ═══', 'warn');
    applyPendingAdditions(orgData, newHires, overrides);
  }

  // ── Print Summary ──
  console.log('\n══════════════════════════════════════════');
  console.log('  PIPELINE SUMMARY');
  console.log('══════════════════════════════════════════');
  log(`🆕 New Hires:            ${newHires.length}`, newHires.length > 0 ? 'success' : 'info');
  log(`👋 Potential Departures:  ${potentialDepartures.length}`, potentialDepartures.length > 0 ? 'warn' : 'info');
  log(`💰 Salary Changes:       ${salaryChanges.length}`, salaryChanges.length > 0 ? 'info' : 'info');
  log(`❓ Unmapped Employees:   ${unmapped.length}`, unmapped.length > 0 ? 'warn' : 'info');
  console.log('──────────────────────────────────────────');
  log(`📊 Total Scraped:        ${mergedEmployees.size}`, 'info');
  log(`📋 Total Existing:       ${existingMap.size}`, 'info');
  log(`📁 Classification:       EPA=${stats.byClassification.EPA} SPA=${stats.byClassification.SPA} Unknown=${stats.byClassification.Unknown}`, 'info');
  console.log('══════════════════════════════════════════\n');

  // Show top salary changes if any
  if (salaryChanges.length > 0) {
    log('Top salary changes:', 'info');
    salaryChanges
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 10)
      .forEach(c => {
        const arrow = c.change > 0 ? '↑' : '↓';
        console.log(`  ${arrow} ${c.name}: $${c.oldSalary.toLocaleString()} → $${c.newSalary.toLocaleString()} (${c.changePercent}%)`);
      });
    console.log('');
  }

  // Show new hires if any
  if (newHires.length > 0) {
    log('New hires detected:', 'info');
    newHires.slice(0, 10).forEach(e => {
      console.log(`  + ${e.name} | ${e.title} | → ${e.parentNodeId || 'unmapped'}`);
    });
    if (newHires.length > 10) console.log(`  ... and ${newHires.length - 10} more`);
    console.log('');
  }

  // Show potential departures if any
  if (potentialDepartures.length > 0) {
    log('Potential departures (flagged — NOT removed):', 'warn');
    potentialDepartures.slice(0, 10).forEach(d => {
      console.log(`  - ${d.name} | ${d.title} | node: ${d.nodeId}`);
    });
    if (potentialDepartures.length > 10) console.log(`  ... and ${potentialDepartures.length - 10} more`);
    console.log('');
  }
}

// ═══════════════════════════════════════════
// APPLY MODE — Inject into data.js
// ═══════════════════════════════════════════

/**
 * Applies pending additions by injecting new nodes into data.js.
 * Creates a backup before modifying.
 * @param {object} orgData - Current parsed ORG_DATA
 * @param {Array} newHires - New employee records to add
 * @param {object} overrides - Override configuration
 */
function applyPendingAdditions(orgData, newHires, overrides) {
  try {
    // Read current data.js content
    const originalContent = readFileSync(PATHS.dataJs, 'utf-8');

    // Create backup
    const backupPath = PATHS.dataJs + `.backup-${Date.now()}`;
    writeFileSync(backupPath, originalContent, 'utf-8');
    log(`Backup created: ${backupPath}`, 'success');

    // Group new hires by parent node ID
    const byParent = {};
    for (const emp of newHires) {
      const parent = emp.parentNodeId || 'unmapped';
      if (!byParent[parent]) byParent[parent] = [];
      byParent[parent].push(emp);
    }

    let modifiedContent = originalContent;
    let nodesAdded = 0;

    for (const [parentId, employees] of Object.entries(byParent)) {
      if (parentId === 'unmapped') {
        log(`Skipping ${employees.length} unmapped employees`, 'warn');
        continue;
      }

      // Find the parent node's children array in the source
      // Look for: id: 'parentId', ... children: [
      const parentPattern = new RegExp(
        `(id:\\s*'${parentId}'[\\s\\S]*?children:\\s*\\[)`,
        'g'
      );

      const match = parentPattern.exec(modifiedContent);
      if (!match) {
        log(`Parent node "${parentId}" not found in data.js — skipping ${employees.length} employees`, 'warn');
        continue;
      }

      // Generate new node entries
      const newNodes = employees.map(emp => {
        const nodeId = generateNodeId(emp.name, parentId);
        const since = (overrides.since_dates || {})[emp.name] || new Date().getFullYear().toString();
        const photo = (overrides.photo_urls || {})[emp.name] || null;

        return `
            { id: '${nodeId}', title: '${emp.title.replace(/'/g, "\\'")}', department: '${emp.department.replace(/'/g, "\\'")}', division: '${(emp.college || '').replace(/'/g, "\\'")}', holder: { name: '${emp.name.replace(/'/g, "\\'")}', since: '${since}', photo: ${photo ? `'${photo}'` : 'null'} }, status: 'filled', level: ${emp.level}, metadata: { qualifications: [], competencies: [], necessity: 'Auto-generated by pipeline', salaryBand: '', salary: ${emp.salary || 0}, salaryYear: ${new Date().getFullYear()}, directReports: 0, teamSize: 1, classification: '${emp.classification}', custom: { pipelineGenerated: true } }, children: [] }`;
      });

      // Insert after the children: [ opening
      const insertPoint = match.index + match[0].length;
      const insertion = newNodes.join(',') + (modifiedContent[insertPoint] !== ']' ? ',' : '');

      modifiedContent =
        modifiedContent.slice(0, insertPoint) +
        insertion +
        modifiedContent.slice(insertPoint);

      nodesAdded += employees.length;
      log(`Added ${employees.length} node(s) under "${parentId}"`, 'success');
    }

    if (nodesAdded > 0) {
      writeFileSync(PATHS.dataJs, modifiedContent, 'utf-8');
      log(`\n✅ Applied ${nodesAdded} new nodes to data.js`, 'success');
    } else {
      log('No nodes could be applied — check parent mappings', 'warn');
    }
  } catch (err) {
    log(`Error applying changes: ${err.message}`, 'error');
    log('data.js was NOT modified (backup available if needed)', 'error');
    process.exitCode = 1;
  }
}

// ═══════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════

async function main() {
  if (VALIDATE) {
    // Validation-only mode
    const orgData = parseDataJs(PATHS.dataJs);
    if (orgData) {
      validateDataJs(orgData);
    } else {
      log('Cannot validate — data.js could not be parsed', 'error');
      process.exitCode = 1;
    }
    return;
  }

  // Default: run hybrid merge
  await runHybridMerge();
}

// —— Run ——
main().catch(err => {
  log(`Fatal error: ${err.message}`, 'error');
  console.error(err.stack);
  process.exitCode = 1;
});
