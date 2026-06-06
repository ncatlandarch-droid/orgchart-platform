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
// Adjust these after inspecting debug HTML output with --debug flag.
// Run: node scraper.js --debug
// Then open ../data/debug-response.html in a browser to see the real structure.
const SELECTORS = {
  // UNC Salary Database selectors
  unc: {
    resultTable: 'table.results, table.salary-table, table#results, table',
    tableRow: 'tbody tr, tr',
    nameCell: 'td:nth-child(1)',
    titleCell: 'td:nth-child(2)',
    salaryCell: 'td:nth-child(3)',
    departmentCell: 'td:nth-child(4)',
    // Pagination
    nextPage: 'a.next, a[rel="next"], .pagination a:last-child',
    totalResults: '.result-count, .total-results, .showing',
  },
  // Fallback: OpenTheBooks selectors
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

/**
 * Returns a formatted timestamp for logging
 * @returns {string} ISO timestamp prefix
 */
function timestamp() {
  return `[${new Date().toISOString()}]`;
}

/**
 * Logs a message with timestamp prefix
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
 * Delays execution for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Parses a salary string into a number
 * @param {string} raw - Raw salary string (e.g. "$85,000.00")
 * @returns {number|null} Parsed salary or null
 */
function parseSalary(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Cleans whitespace and trims a string
 * @param {string} raw - Raw text
 * @returns {string} Cleaned text
 */
function cleanText(raw) {
  if (!raw) return '';
  return raw.replace(/\s+/g, ' ').trim();
}

/**
 * Ensures the data output directory exists
 */
function ensureDataDir() {
  if (!existsSync(CONFIG.dataDir)) {
    mkdirSync(CONFIG.dataDir, { recursive: true });
    log(`Created data directory: ${CONFIG.dataDir}`, 'info');
  }
}

/**
 * Fetches a URL with retry logic and rate limiting.
 * Uses exponential backoff between retries.
 * @param {string} url - URL to fetch
 * @param {RequestInit} [options={}] - Fetch options
 * @param {number} [attempt=1] - Current attempt number
 * @returns {Promise<Response>} Fetch response
 */
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
 * POSTs the agreement form and returns cookies for subsequent requests.
 * @returns {Promise<string|null>} Session cookie string or null on failure
 */
async function acceptUNCTerms() {
  log('Accepting UNC Salary Database terms of use...', 'info');

  try {
    const response = await fetchWithRetry(
      'https://uncdm.northcarolina.edu/salaries/index.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=agree',
        redirect: 'manual',
      }
    );

    // Extract session cookies from Set-Cookie headers
    const cookies = response.headers.getSetCookie?.() || [];
    const cookieStr = cookies.map(c => c.split(';')[0]).join('; ');

    if (cookieStr) {
      log('Session cookie obtained successfully', 'success');
    } else {
      log('No session cookie received — proceeding anyway', 'warn');
    }

    // If we got a redirect, follow it manually with cookies
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      log(`Redirected to: ${location}`, 'info');
    }

    return cookieStr || '';
  } catch (err) {
    log(`Failed to accept terms: ${err.message}`, 'error');
    return null;
  }
}

/**
 * Searches the UNC salary database for the configured institution.
 * @param {string} cookies - Session cookies from acceptUNCTerms()
 * @param {number} [page=1] - Page number to fetch
 * @returns {Promise<{html: string, status: number}>}
 */
async function searchUNCSalaryDB(cookies, page = 1) {
  log(`Searching UNC Salary DB for "${CONFIG.institution}" (page ${page})...`, 'info');

  // Build search parameters — the exact params may need adjusting
  // after inspecting the form with --debug
  const params = new URLSearchParams({
    action: 'search',
    institution: CONFIG.institution,
    name: '',
    page: page.toString(),
  });

  try {
    const response = await fetchWithRetry(
      'https://uncdm.northcarolina.edu/salaries/index.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies,
        },
        body: params.toString(),
      }
    );

    const html = await response.text();
    return { html, status: response.status };
  } catch (err) {
    log(`Search failed: ${err.message}`, 'error');
    return { html: '', status: 0 };
  }
}

/**
 * Parses employee data from UNC salary DB HTML.
 * NOTE: Selectors are configurable — run with --debug first to
 * inspect the actual page structure, then update SELECTORS.unc.
 * @param {string} html - Raw HTML response
 * @returns {Array<{name: string, title: string, salary: number|null, department: string}>}
 */
function parseUNCResults(html) {
  const $ = load(html);
  const employees = [];
  const sel = SELECTORS.unc;

  // Try to find the results table
  const table = $(sel.resultTable).first();
  if (!table.length) {
    log('No results table found in UNC response', 'warn');
    return employees;
  }

  // Parse each row
  $(sel.tableRow, table).each((i, row) => {
    const $row = $(row);

    // Skip header rows
    if ($row.find('th').length > 0) return;

    const name = cleanText($row.find(sel.nameCell).text());
    const title = cleanText($row.find(sel.titleCell).text());
    const salaryRaw = cleanText($row.find(sel.salaryCell).text());
    const department = cleanText($row.find(sel.departmentCell).text());

    // Only add if we have at least a name
    if (name && name.toLowerCase() !== 'name') {
      employees.push({
        name,
        title,
        salary: parseSalary(salaryRaw),
        department: department || null,
      });
    }
  });

  return employees;
}

/**
 * Checks if there's a next page in the UNC results
 * @param {string} html - Current page HTML
 * @returns {boolean} True if more pages exist
 */
function hasNextPageUNC(html) {
  const $ = load(html);
  return $(SELECTORS.unc.nextPage).length > 0;
}

/**
 * Full scrape of UNC Salary Database with pagination.
 * Handles session management, searching, and page iteration.
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

  let allEmployees = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { html, status } = await searchUNCSalaryDB(cookies, page);

    // Save debug HTML on first page
    if (DEBUG && page === 1) {
      ensureDataDir();
      writeFileSync(CONFIG.debugPath, html, 'utf-8');
      log(`Debug HTML saved to: ${CONFIG.debugPath}`, 'info');
    }

    if (status === 0 || !html) {
      log('Empty response — stopping pagination', 'warn');
      break;
    }

    const pageEmployees = parseUNCResults(html);
    log(`Page ${page}: found ${pageEmployees.length} employees`, 'info');

    if (pageEmployees.length === 0) {
      log('No employees found on this page — stopping', 'info');
      break;
    }

    allEmployees = allEmployees.concat(pageEmployees);
    hasMore = hasNextPageUNC(html);
    page++;

    if (hasMore) {
      await sleep(CONFIG.rateLimitMs);
    }
  }

  log(`UNC DB total: ${allEmployees.length} employees across ${page} page(s)`, 'success');
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
