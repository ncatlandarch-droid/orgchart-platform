#!/usr/bin/env node
/* ============================================
 * ORGCHART PIPELINE — Directory Scraper
 * --------------------------------------------
 * Scrapes the NC A&T Employee Directory to
 * extract departmental assignments, titles,
 * contact info, and college affiliations.
 * 
 * Source: https://www.ncat.edu/directory/
 * 
 * Usage:
 *   node directory-scraper.js          # Full scrape
 *   node directory-scraper.js --debug  # Save raw HTML
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
  baseUrl: 'https://www.ncat.edu/directory/index.php',
  outputPath: resolve(__dirname, '../data/directory-employees.json'),
  debugDir: resolve(__dirname, '../data/debug'),
  dataDir: resolve(__dirname, '../data'),
  rateLimitMs: 1000, // 1 second between requests (respectful)
  maxRetries: 3,
  retryDelayMs: 2000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};

// —— NC A&T Colleges and Units to search ——
const COLLEGES = [
  'College of Agriculture and Environmental Sciences',
  'College of Arts, Humanities and Social Sciences',
  'College of Business and Economics',
  'College of Education',
  'College of Engineering',
  'College of Health and Human Sciences',
  'College of Science and Technology',
  'Joint School of Nanoscience and Nanoengineering',
  'School of Nursing',
  'Graduate College',
  'Division of Research and Economic Development',
  'Division of Student Affairs',
  'Division of Information Technology and Telecommunications',
  'Division of Business and Finance',
  'Division of University Advancement',
  'Athletics',
  'Library',
  'Office of the Chancellor',
  'Human Resources',
  'Enrollment Management',
  'Facilities',
];

// —— Configurable CSS Selectors ——
// Adjust these after inspecting the directory page with --debug.
// Run: node directory-scraper.js --debug
// Then open ../data/debug/directory-*.html files in a browser.
const SELECTORS = {
  // Main directory search results
  resultContainer: '.directory-results, .search-results, #results, .listing',
  resultCard: '.directory-entry, .result-item, .person-card, .vcard, tr',
  // Individual fields within each card/row
  name: '.name, .fn, h3, h4, td:nth-child(1), strong',
  title: '.title, .job-title, .role, td:nth-child(2)',
  department: '.department, .org, .unit, td:nth-child(3)',
  college: '.college, .division, td:nth-child(4)',
  email: '.email a, a[href^="mailto:"], .email',
  phone: '.phone, .tel, td:nth-child(5)',
  // Pagination
  nextPage: 'a.next, a[rel="next"], .pagination .next, .pager-next a',
  // Search form
  searchForm: 'form#directory-search, form.search-form, form',
};

// —— CLI Flags ——
const args = process.argv.slice(2);
const DEBUG = args.includes('--debug');

// —— Utility Functions ——

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
 * Delays execution for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
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
 * Extracts a clean email address from various formats
 * @param {string} raw - Raw email text or mailto link
 * @returns {string} Clean email address or empty string
 */
function extractEmail(raw) {
  if (!raw) return '';
  const cleaned = raw.replace(/^mailto:/i, '').trim();
  const match = cleaned.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

/**
 * Cleans a phone number string, keeping only digits and formatting chars
 * @param {string} raw - Raw phone text
 * @returns {string} Cleaned phone number
 */
function cleanPhone(raw) {
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d()\-\s+.ext]/gi, '').trim();
  return cleaned || '';
}

/**
 * Ensures the data output directory exists
 */
function ensureDataDir() {
  if (!existsSync(CONFIG.dataDir)) {
    mkdirSync(CONFIG.dataDir, { recursive: true });
    log(`Created data directory: ${CONFIG.dataDir}`, 'info');
  }
  if (DEBUG && !existsSync(CONFIG.debugDir)) {
    mkdirSync(CONFIG.debugDir, { recursive: true });
    log(`Created debug directory: ${CONFIG.debugDir}`, 'info');
  }
}

/**
 * Fetches a URL with retry logic and exponential backoff
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
        'Accept': 'text/html,application/xhtml+xml',
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
// DIRECTORY SCRAPING LOGIC
// ═══════════════════════════════════════════

/**
 * Fetches the directory page for a given college/unit search query.
 * Constructs a GET request with the college name as a query parameter.
 * @param {string} query - College or unit name to search for
 * @param {number} [page=1] - Page number
 * @returns {Promise<{html: string, status: number}>}
 */
async function fetchDirectoryPage(query, page = 1) {
  const url = new URL(CONFIG.baseUrl);
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'employee');
  if (page > 1) {
    url.searchParams.set('page', page.toString());
  }

  try {
    const response = await fetchWithRetry(url.toString());
    const html = await response.text();
    return { html, status: response.status };
  } catch (err) {
    log(`Failed to fetch directory for "${query}": ${err.message}`, 'error');
    return { html: '', status: 0 };
  }
}

/**
 * Parses employee entries from directory HTML.
 * Uses configurable selectors — adjust SELECTORS after --debug inspection.
 * @param {string} html - Raw HTML response
 * @param {string} collegeContext - College name for context enrichment
 * @returns {Array<{name: string, title: string, department: string, college: string, email: string, phone: string}>}
 */
function parseDirectoryResults(html, collegeContext) {
  const $ = load(html);
  const employees = [];

  // Try to find result cards
  const cards = $(SELECTORS.resultCard);

  if (cards.length === 0) {
    log(`No employee cards found for "${collegeContext}"`, 'warn');
    return employees;
  }

  cards.each((i, card) => {
    const $card = $(card);

    // Skip header rows in tables
    if ($card.find('th').length > 0) return;

    const name = cleanText($card.find(SELECTORS.name).first().text());
    const title = cleanText($card.find(SELECTORS.title).first().text());
    const department = cleanText($card.find(SELECTORS.department).first().text());
    const college = cleanText($card.find(SELECTORS.college).first().text()) || collegeContext;

    // Email: try href first, then text content
    const emailLink = $card.find(SELECTORS.email).attr('href') || '';
    const emailText = $card.find(SELECTORS.email).text() || '';
    const email = extractEmail(emailLink || emailText);

    const phone = cleanPhone($card.find(SELECTORS.phone).first().text());

    // Only add if we have at least a name with real content
    if (name && name.length > 1 && !name.toLowerCase().includes('name')) {
      employees.push({
        name,
        title: title || '',
        department: department || '',
        college: college || collegeContext,
        email,
        phone,
      });
    }
  });

  return employees;
}

/**
 * Checks if the directory results have a next page
 * @param {string} html - Current page HTML
 * @returns {boolean} True if more pages exist
 */
function hasNextPage(html) {
  const $ = load(html);
  return $(SELECTORS.nextPage).length > 0;
}

/**
 * Scrapes all employees for a given college/unit.
 * Handles pagination up to a safety limit of 20 pages per college.
 * @param {string} college - College or unit name to search
 * @returns {Promise<Array>} Employee records
 */
async function scrapeCollege(college) {
  log(`Scraping directory for: ${college}`, 'info');

  let allEmployees = [];
  let page = 1;
  let hasMore = true;
  const maxPages = 20; // Safety limit per college

  while (hasMore && page <= maxPages) {
    const { html, status } = await fetchDirectoryPage(college, page);

    // Save debug HTML on first page of each college
    if (DEBUG && page === 1) {
      const debugFile = resolve(
        CONFIG.debugDir,
        `directory-${college.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}.html`
      );
      writeFileSync(debugFile, html, 'utf-8');
      log(`Debug HTML saved: ${debugFile}`, 'info');
    }

    if (status === 0 || !html) break;

    const pageEmployees = parseDirectoryResults(html, college);

    if (pageEmployees.length === 0) {
      if (page === 1) {
        log(`  No employees found for "${college}"`, 'warn');
      }
      break;
    }

    allEmployees = allEmployees.concat(pageEmployees);
    log(`  Page ${page}: ${pageEmployees.length} employees`, 'info');

    hasMore = hasNextPage(html);
    page++;

    if (hasMore) {
      await sleep(CONFIG.rateLimitMs);
    }
  }

  return allEmployees;
}

// ═══════════════════════════════════════════
// DEDUPLICATION
// ═══════════════════════════════════════════

/**
 * Normalizes a name for deduplication comparison.
 * Strips honorifics, degrees, suffixes, and non-alpha characters.
 * @param {string} name - Raw name
 * @returns {string} Normalized name key
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\b(dr|mr|mrs|ms|prof)\.?\s*/gi, '')
    .replace(/,?\s*(ph\.?d\.?|ed\.?d\.?|m\.?d\.?|j\.?d\.?|m\.?s\.?|m\.?a\.?)/gi, '')
    .replace(/,?\s*(jr\.?|sr\.?|ii|iii|iv)/gi, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deduplicates employee list by normalized name.
 * When duplicates are found, merges the most complete data.
 * @param {Array} employees - All scraped employees
 * @returns {Array} Deduplicated employees
 */
function deduplicateEmployees(employees) {
  const seen = new Map();
  const deduplicated = [];

  for (const emp of employees) {
    const key = normalizeName(emp.name);
    if (!key) continue;

    if (seen.has(key)) {
      // Merge: keep the record with more data
      const existing = seen.get(key);
      if (!existing.email && emp.email) existing.email = emp.email;
      if (!existing.phone && emp.phone) existing.phone = emp.phone;
      if (!existing.department && emp.department) existing.department = emp.department;
      if (!existing.title && emp.title) existing.title = emp.title;
    } else {
      seen.set(key, { ...emp });
      deduplicated.push(seen.get(key));
    }
  }

  return deduplicated;
}

// ═══════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════

/**
 * Main entry point for the directory scraper.
 * Iterates through all colleges, scrapes employee data,
 * deduplicates, and saves to JSON.
 */
async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   ORGCHART PIPELINE — Directory Scraper  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (DEBUG) log('DEBUG mode — raw HTML will be saved', 'warn');

  ensureDataDir();

  let allEmployees = [];
  let successfulColleges = 0;
  let failedColleges = 0;

  for (let i = 0; i < COLLEGES.length; i++) {
    const college = COLLEGES[i];
    log(`\n── [${i + 1}/${COLLEGES.length}] ${college} ──`, 'info');

    try {
      const employees = await scrapeCollege(college);
      allEmployees = allEmployees.concat(employees);

      if (employees.length > 0) {
        successfulColleges++;
        log(`  Found ${employees.length} employees`, 'success');
      } else {
        failedColleges++;
      }
    } catch (err) {
      failedColleges++;
      log(`  Error scraping "${college}": ${err.message}`, 'error');
    }

    // Rate limiting between colleges
    if (i < COLLEGES.length - 1) {
      await sleep(CONFIG.rateLimitMs);
    }
  }

  // Deduplicate
  log('\nDeduplicating employee records...', 'info');
  const beforeCount = allEmployees.length;
  allEmployees = deduplicateEmployees(allEmployees);
  const dupsRemoved = beforeCount - allEmployees.length;

  // Add scrape timestamp
  const scrapedAt = new Date().toISOString();
  const results = allEmployees.map(emp => ({ ...emp, scrapedAt }));

  // Summary
  console.log('\n══ RESULTS ══');
  log(`Total employees: ${results.length}`, 'success');
  log(`Duplicates removed: ${dupsRemoved}`, 'info');
  log(`Successful colleges: ${successfulColleges}/${COLLEGES.length}`, 'info');
  log(`Failed colleges: ${failedColleges}/${COLLEGES.length}`, failedColleges > 0 ? 'warn' : 'info');

  // College breakdown
  const byCollege = {};
  results.forEach(emp => {
    const key = emp.college || 'Unknown';
    byCollege[key] = (byCollege[key] || 0) + 1;
  });
  log('\nBy College:', 'info');
  Object.entries(byCollege)
    .sort((a, b) => b[1] - a[1])
    .forEach(([college, count]) => {
      console.log(`  • ${college}: ${count}`);
    });

  // Show sample
  if (results.length > 0) {
    log('\nSample entries:', 'info');
    results.slice(0, 5).forEach(e => {
      console.log(`  • ${e.name} | ${e.title} | ${e.department} | ${e.college}`);
    });
    if (results.length > 5) console.log(`  ... and ${results.length - 5} more`);
  }

  // Save results
  if (results.length > 0) {
    writeFileSync(CONFIG.outputPath, JSON.stringify(results, null, 2), 'utf-8');
    log(`\nSaved ${results.length} employees to: ${CONFIG.outputPath}`, 'success');
  } else {
    log('\nNo employees found — check selectors with --debug flag', 'error');
    log('Inspect debug HTML files and update SELECTORS constant.', 'warn');
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
