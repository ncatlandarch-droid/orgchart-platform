#!/usr/bin/env node
/* ============================================
 * ORGCHART PIPELINE — Salary Scraper
 * --------------------------------------------
 * Scrapes the UNC System Salary Information
 * Database for NC A&T State University employees.
 * 
 * Primary source: UNC Salary Database
 * Fallback source: OpenTheBooks.com
 * 
 * Usage:
 *   node scraper.js            # Full scrape
 *   node scraper.js --dry-run  # Preview without saving
 *   node scraper.js --debug    # Save raw HTML for inspection
 * 
 * Last updated: June 2026
 * ============================================ */

import { load } from 'cheerio';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// —— ES Module dirname shim ——
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// —— Configuration ——
const CONFIG = {
  institution: 'North Carolina A&T State University',
  outputPath: resolve(__dirname, '../data/raw-employees.json'),
  debugPath: resolve(__dirname, '../data/debug-response.html'),
  dataDir: resolve(__dirname, '../data'),
  maxRetries: 3,
  retryDelayMs: 2000,
  rateLimitMs: 500,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};

// —— Configurable CSS Selectors (Primary Source: UNC Salary DB) ——
// These match the actual UNC Salary DB structure discovered via --debug.
// The DB uses ajax.php with jQuery DataTables paging (pageSize=20).
// Campus code for NC A&T is "NCA&T" in the multi-select #Campus dropdown.
const SELECTORS = {
  unc: {
    resultTable: 'table.salaryGrid, table#resultsTable, table',
    tableRow: 'tbody tr',
    // The accordion-toggle rows contain the summary data
    // Columns: Name, Working Title, Department, Campus, Snapshot Date, Salary
    nameCell: 'td:nth-child(1)',
    titleCell: 'td:nth-child(2)',
    departmentCell: 'td:nth-child(3)',
    campusCell: 'td:nth-child(4)',
    salaryCell: 'td:nth-child(6)',
  },
  openBooks: {
    resultTable: 'table, .search-results',
    tableRow: 'tbody tr, .result-row',
    nameCell: 'td:nth-child(1), .employee-name',
    titleCell: 'td:nth-child(2), .employee-title',
    salaryCell: 'td:nth-child(3), .employee-salary',
    departmentCell: 'td:nth-child(4), .employee-dept',
    nextPage: 'a.next, .pagination-next',
  },
};

// —— CLI Flags ——
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DEBUG = args.includes('--debug');

// —— Utility Functions ——

function timestamp() {
  return `[${new Date().toISOString()}]`;
}

function log(msg, level = 'info') {
  const prefix = {
    info: '\x1b[36mℹ\x1b[0m',
    warn: '\x1b[33m⚠\x1b[0m',
    error: '\x1b[31m✖\x1b[0m',
    success: '\x1b[32m✔\x1b[0m',
  };
  console.log(`${timestamp()} ${prefix[level] || '•'} ${msg}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseSalary(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function cleanText(raw) {
  if (!raw) return '';
  return raw.replace(/\s+/g, ' ').trim();
}

function ensureDataDir() {
  if (!existsSync(CONFIG.dataDir)) {
    mkdirSync(CONFIG.dataDir, { recursive: true });
    log(`Created data directory: ${CONFIG.dataDir}`, 'info');
  }
}

async function fetchWithRetry(url, options = {}, attempt = 1) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': CONFIG.userAgent,
        ...(options.headers || {}),
      },
    });
    if (!response.ok && attempt < CONFIG.maxRetries) {
      log(`HTTP ${response.status} — retrying (${attempt}/${CONFIG.maxRetries})...`, 'warn');
      await sleep(CONFIG.retryDelayMs * attempt);
      return fetchWithRetry(url, options, attempt + 1);
    }
    return response;
  } catch (err) {
    if (attempt < CONFIG.maxRetries) {
      log(`Network error: ${err.message} — retrying (${attempt}/${CONFIG.maxRetries})...`, 'warn');
      await sleep(CONFIG.retryDelayMs * attempt);
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw err;
  }
}

// ═══════════════════════════════════════════
// PRIMARY SOURCE: UNC Salary Database
// ═══════════════════════════════════════════

/**
 * Accepts the terms of use on the UNC salary database.
 * @returns {Promise<string|null>} Session cookie string or null
 */
async function acceptUNCTerms() {
  log('Accepting UNC Salary Database terms of use...', 'info');
  try {
    const response = await fetchWithRetry(
      'https://uncdm.northcarolina.edu/salaries/index.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=agree',
        redirect: 'manual',
      }
    );
    const cookies = response.headers.getSetCookie?.() || [];
    const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');
    if (cookieStr) {
      log('Session cookie obtained successfully', 'success');
    } else {
      log('No session cookie received — proceeding anyway', 'warn');
    }
    return cookieStr || '';
  } catch (err) {
    log(`Failed to accept terms: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Searches the UNC salary database via ajax.php endpoint.
 * The form uses: Campus[]=NCA&T, with pagination via gaPaging plugin (pageSize=20).
 * @param {string} cookies - Session cookies
 * @param {number} [page=1] - Page number (1-based)
 * @returns {Promise<{html: string, status: number}>}
 */
async function searchUNCSalaryDB(cookies, page = 1, lastNameFilter = '') {
  const filterLabel = lastNameFilter ? ` [last="${lastNameFilter}"]` : '';
  log(`Querying UNC Salary DB ajax.php for NCA&T${filterLabel} (page ${page})...`, 'info');

  const body = new URLSearchParams();
  body.append('type', 'json');
  body.append('campus', 'NCA&T');
  body.append('department', '');
  body.append('first', '');
  body.append('last', lastNameFilter);
  body.append('position', '');
  body.append('salary', '');
  body.append('page', page.toString());
  body.append('pageSize', '500');

  try {
    const response = await fetchWithRetry(
      'https://uncdm.northcarolina.edu/salaries/ajax.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies,
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://uncdm.northcarolina.edu/salaries/index.php',
        },
        body: body.toString(),
      }
    );
    const text = await response.text();
    return { html: text, status: response.status };
  } catch (err) {
    log(`Search failed: ${err.message}`, 'error');
    return { html: '', status: 0 };
  }
}

/**
 * Parses employee data from UNC salary DB AJAX JSON response.
 * Actual format: { totalRecords: N, names: [colNames], data: [[row], [row], ...] }
 * @param {string} responseText - Raw JSON response from ajax.php
 * @returns {{ employees: Array, totalRecords: number }}
 */
function parseUNCResults(responseText) {
  const employees = [];
  try {
    const json = JSON.parse(responseText);
    if (json.totalRecords !== undefined && json.names && json.data) {
      const cols = {};
      json.names.forEach((name, i) => { cols[name.toLowerCase()] = i; });
      const iFirst = cols['first'] ?? 1;
      const iLast = cols['last'] ?? 2;
      const iDept = cols['department'] ?? 3;
      const iPosition = cols['position'] ?? 4;
      const iSalary = cols['salary'] ?? 5;
      json.data.forEach(row => {
        if (!Array.isArray(row)) return;
        const first = cleanText(row[iFirst] || '');
        const last = cleanText(row[iLast] || '');
        const name = `${first} ${last}`.trim();
        const department = cleanText(row[iDept] || '');
        const title = cleanText(row[iPosition] || '');
        const salary = parseSalary(String(row[iSalary] || ''));
        if (name && name.length > 1) {
          employees.push({ name, title, salary, department: department || null });
        }
      });
      return { employees, totalRecords: json.totalRecords };
    }
    if (Array.isArray(json)) {
      json.forEach(item => {
        const name = cleanText((item.first || '') + ' ' + (item.last || item.name || '')).trim();
        const title = cleanText(item.position || item.title || '');
        const department = cleanText(item.department || '');
        const salary = parseSalary(String(item.salary || ''));
        if (name) employees.push({ name, title, salary, department: department || null });
      });
    }
  } catch {
    log('Response is not valid JSON — cannot parse', 'warn');
  }
  return { employees, totalRecords: employees.length };
}

/**
 * Fetches all employees for a given last-name filter (or all if empty).
 * Paginates through all pages for the query.
 * @param {string} cookies - Session cookies
 * @param {string} [lastNameFilter=''] - Filter by last name starting with
 * @returns {Promise<Array>} Employees found
 */
async function fetchAllPages(cookies, lastNameFilter = '') {
  let employees = [];
  let page = 1;
  let totalRecords = 0;
  const maxPages = 20;

  while (page <= maxPages) {
    const { html, status } = await searchUNCSalaryDB(cookies, page, lastNameFilter);

    if (DEBUG && page === 1 && !lastNameFilter) {
      ensureDataDir();
      writeFileSync(CONFIG.debugPath, html, 'utf-8');
      log(`Debug HTML saved to: ${CONFIG.debugPath}`, 'info');
    }

    if (status === 0 || !html) break;

    const result = parseUNCResults(html);
    if (page === 1) totalRecords = result.totalRecords;

    if (result.employees.length === 0) break;

    employees = employees.concat(result.employees);

    // If we got all results or fewer than a full page, done
    if (employees.length >= totalRecords || result.employees.length < 500) break;

    page++;
    await sleep(CONFIG.rateLimitMs);
  }

  return { employees, totalRecords };
}

/**
 * Full comprehensive scrape of UNC Salary Database.
 * Strategy: 
 *   1. Try fetching all employees in one query
 *   2. If server caps results (returns fewer than totalRecords),
 *      switch to letter-by-letter mode (A-Z) to capture everyone
 * @returns {Promise<Array>} All employees found
 */
async function scrapeUNCSalaryDB() {
  log('═══ Starting UNC Salary Database scrape ═══', 'info');

  const cookies = await acceptUNCTerms();
  if (cookies === null) {
    log('Could not establish session with UNC DB', 'error');
    return [];
  }

  await sleep(CONFIG.rateLimitMs);

  // Step 1: Try broad query first
  const initial = await fetchAllPages(cookies);
  log(`Broad query: ${initial.employees.length} employees (server reports ${initial.totalRecords})`, 'info');

  let allEmployees = initial.employees;

  // Step 2: If we got fewer than totalRecords, the server capped results.
  // Switch to letter-by-letter comprehensive mode.
  if (allEmployees.length < initial.totalRecords * 0.95) {
    log(`Server capped at ${allEmployees.length}/${initial.totalRecords} — augmenting with letter-by-letter mode...`, 'warn');
    
    // MERGE: keep broad results and add letter-by-letter on top (dedup handles overlap)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let letterTotal = 0;
    
    for (const letter of alphabet) {
      const result = await fetchAllPages(cookies, letter);
      if (result.employees.length > 0) {
        log(`  Letter ${letter}: ${result.employees.length} employees`, 'info');
        allEmployees = allEmployees.concat(result.employees);
        letterTotal += result.employees.length;
      }
      await sleep(CONFIG.rateLimitMs);
    }
    
    log(`Letter-by-letter added ${letterTotal} raw results (will dedup with broad query)`, 'success');
  }

  // Deduplicate by normalized name
  const seen = new Set();
  allEmployees = allEmployees.filter(emp => {
    const key = emp.name.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  log(`UNC DB total: ${allEmployees.length} unique employees (API reported ${initial.totalRecords})`, 'success');
  return allEmployees;
}

// ═══════════════════════════════════════════
// FALLBACK SOURCE: OpenTheBooks.com
// ═══════════════════════════════════════════

/**
 * Searches OpenTheBooks.com as a fallback salary source.
 * Used when the UNC salary database is inaccessible or returns
 * insufficient results.
 * @param {number} [page=1] - Page number to fetch
 * @returns {Promise<{html: string, status: number}>}
 */
async function searchOpenTheBooks(page = 1) {
  log(`Searching OpenTheBooks.com (page ${page})...`, 'info');

  const searchUrl = new URL('https://www.openthebooks.com/north-carolina-state-employees/');
  searchUrl.searchParams.set('employer_key', CONFIG.institution);
  searchUrl.searchParams.set('page', page.toString());

  try {
    const response = await fetchWithRetry(searchUrl.toString(), {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    const html = await response.text();
    return { html, status: response.status };
  } catch (err) {
    log(`OpenTheBooks search failed: ${err.message}`, 'error');
    return { html: '', status: 0 };
  }
}

/**
 * Parses employee data from OpenTheBooks HTML
 * @param {string} html - Raw HTML response
 * @returns {Array<{name: string, title: string, salary: number|null}>}
 */
function parseOpenTheBooksResults(html) {
  const $ = load(html);
  const employees = [];
  const sel = SELECTORS.openBooks;

  const table = $(sel.resultTable).first();
  if (!table.length) {
    log('No results table found in OpenTheBooks response', 'warn');
    return employees;
  }

  $(sel.tableRow, table).each((i, row) => {
    const $row = $(row);
    if ($row.find('th').length > 0) return;

    const name = cleanText($row.find(sel.nameCell).text());
    const title = cleanText($row.find(sel.titleCell).text());
    const salaryRaw = cleanText($row.find(sel.salaryCell).text());

    if (name && name.toLowerCase() !== 'name') {
      employees.push({
        name,
        title,
        salary: parseSalary(salaryRaw),
      });
    }
  });

  return employees;
}

/**
 * Full scrape of OpenTheBooks with pagination (fallback source).
 * Capped at 50 pages as a safety limit.
 * @returns {Promise<Array>} All employees found
 */
async function scrapeOpenTheBooks() {
  log('═══ Starting OpenTheBooks.com fallback scrape ═══', 'info');

  let allEmployees = [];
  let page = 1;
  let hasMore = true;
  const maxPages = 50; // Safety limit

  while (hasMore && page <= maxPages) {
    const { html, status } = await searchOpenTheBooks(page);

    if (DEBUG && page === 1) {
      ensureDataDir();
      const fallbackDebugPath = CONFIG.debugPath.replace('.html', '-openbooks.html');
      writeFileSync(fallbackDebugPath, html, 'utf-8');
      log(`Debug HTML saved to: ${fallbackDebugPath}`, 'info');
    }

    if (status === 0 || !html) break;

    const pageEmployees = parseOpenTheBooksResults(html);
    log(`Page ${page}: found ${pageEmployees.length} employees`, 'info');

    if (pageEmployees.length === 0) break;

    allEmployees = allEmployees.concat(pageEmployees);

    // Check for next page link
    const $ = load(html);
    hasMore = $(SELECTORS.openBooks.nextPage).length > 0;
    page++;

    if (hasMore) {
      await sleep(CONFIG.rateLimitMs);
    }
  }

  log(`OpenTheBooks total: ${allEmployees.length} employees across ${page} page(s)`, 'success');
  return allEmployees;
}

// ═══════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════

/**
 * Main entry point — attempts primary source, falls back if needed.
 * Orchestrates the full salary scraping pipeline.
 */
async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   ORGCHART PIPELINE — Salary Scraper     ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (DRY_RUN) log('DRY RUN mode — no files will be saved', 'warn');
  if (DEBUG) log('DEBUG mode — raw HTML will be saved', 'warn');

  ensureDataDir();

  // Attempt primary source first
  let employees = await scrapeUNCSalaryDB();

  // Fallback to OpenTheBooks if primary source yields too few results
  if (employees.length < 10) {
    log('Primary source returned insufficient data — trying fallback...', 'warn');
    const fallbackEmployees = await scrapeOpenTheBooks();

    if (fallbackEmployees.length > employees.length) {
      log(`Fallback returned ${fallbackEmployees.length} vs primary ${employees.length} — using fallback`, 'info');
      employees = fallbackEmployees;
    }
  }

  // Add metadata to each record
  const scrapedAt = new Date().toISOString();
  const results = employees.map(emp => ({
    ...emp,
    scrapedAt,
  }));

  // Output results
  log(`\n══ RESULTS ══`, 'info');
  log(`Total employees found: ${results.length}`, 'success');

  if (results.length > 0) {
    // Show sample
    log('Sample entries:', 'info');
    results.slice(0, 5).forEach(e => {
      console.log(`  • ${e.name} | ${e.title} | $${(e.salary || 0).toLocaleString()}`);
    });
    if (results.length > 5) console.log(`  ... and ${results.length - 5} more`);
  }

  // Save or preview
  if (DRY_RUN) {
    log('Dry run complete — no files written', 'warn');
  } else if (results.length > 0) {
    writeFileSync(CONFIG.outputPath, JSON.stringify(results, null, 2), 'utf-8');
    log(`Saved ${results.length} employees to: ${CONFIG.outputPath}`, 'success');
  } else {
    log('No employees found — check selectors with --debug flag', 'error');
    log('The HTML structure may have changed. Inspect debug-response.html and update SELECTORS.', 'warn');
    process.exitCode = 1;
  }

  console.log('');
}

// —— Run ——
main().catch(err => {
  log(`Fatal error: ${err.message}`, 'error');
  console.error(err.stack);
  process.exitCode = 1;
});
