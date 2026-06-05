/**
 * Script to add salary and salaryYear data to all positions in data.js
 * Run with: node tools/add-salaries.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Map of position id -> salary
const salaryMap = {
  // === Executive Level (Level 1-2) ===
  'chancellor': 550000,
  'provost': 375000,
  'finance': 295000,          // VC Business & Finance
  'student-affairs': 265000,  // VC Student Affairs
  'research': 310000,         // VC Research
  'advancement': 275000,      // VC University Advancement
  'it': 255000,               // VC IT / CIO
  'chief-staff': 195000,      // Chief of Staff
  'legal': 245000,            // General Counsel
  'athletics': 350000,        // Athletic Director
  'strategic': 235000,        // VC Strategic Partnerships (similar to VC HR level)

  // === Deans (Level 3) ===
  'coe': 285000,              // Dean, College of Engineering
  'cost': 265000,             // Dean, College of Science & Technology
  'caes': 255000,             // Dean, College of Agriculture
  'cobe': 275000,             // Dean, College of Business
  'cahss': 245000,            // Dean, College of Arts Humanities & Social Sciences
  'coed': 240000,             // Dean, College of Education
  'chhs': 250000,             // Dean, College of Health & Human Sciences
  'jsnn': 295000,             // Dean, Joint School of Nanoscience
  'grad': 235000,             // Dean, Graduate College
  'honors': 155000,           // Director, Honors College (director-level, not full dean)
  'registrar': 135000,        // University Registrar

  // === ROTC (Military pay — federally funded) ===
  'rotc-army': 125000,        // Army ROTC Commander (O-5/O-6 equivalent)
  'rotc-af': 122000,          // Air Force ROTC Commander

  // === Associate/Assistant Deans (Level 4) ===
  'grad-assoc': 165000,       // Associate Dean, Graduate College

  // === Engineering Department Chairs (Level 4, STEM) ===
  'coe-cbbe': 185000,         // Chair, Chemical/Biological/Bio Engineering
  'coe-caee': 178000,         // Chair, Civil/Architectural/Environmental Engineering
  'coe-cs': 195000,           // Chair, Computer Science (highest demand)
  'coe-cdse': 188000,         // Chair, Computational Data Science & Engineering
  'coe-ece': 182000,          // Chair, Electrical & Computer Engineering
  'coe-ise': 175000,          // Chair, Industrial & Systems Engineering
  'coe-meen': 180000,         // Chair, Mechanical Engineering

  // === Science & Technology Department Chairs (Level 4, STEM) ===
  'cost-bio': 168000,         // Chair, Biology
  'cost-chem': 165000,        // Chair, Chemistry
  'cost-math': 158000,        // Chair, Mathematics & Statistics
  'cost-phys': 162000,        // Chair, Physics
  'cost-aet': 148000,         // Chair, Applied Engineering Technology
  'cost-be': 145000,          // Chair, Built Environment
  'cost-cst': 152000,         // Chair, Computer Systems Technology

  // === Agriculture Department Chairs (Level 4) ===
  'caes-abaee': 145000,       // Chair, Agribusiness/Applied Economics
  'caes-ansc': 142000,        // Chair, Animal Sciences
  'caes-fcs': 138000,         // Chair, Family & Consumer Sciences
  'caes-nred': 148000,        // Chair, Natural Resources & Environmental Design
  'caes-ext': 155000,         // Director, Cooperative Extension

  // === Business Department Chairs (Level 4) ===
  'cobe-af': 172000,          // Chair, Accounting & Finance (AACSB premium)
  'cobe-mscm': 165000,       // Chair, Marketing & Supply Chain Management
  'cobe-econ': 158000,        // Chair, Economics
  'cobe-bisa': 168000,        // Chair, Business Information Systems & Analytics
  'cobe-mgmt': 162000,        // Chair, Management
  'cobe-ti': 145000,          // Director, Transportation Institute

  // === Arts/Humanities/Social Sciences Department Chairs (Level 4) ===
  'cahss-cj': 148000,         // Chair, Criminal Justice
  'cahss-eng': 135000,        // Chair, English
  'cahss-hps': 138000,        // Chair, History & Political Science
  'cahss-jmc': 142000,        // Chair, Journalism & Mass Communication
  'cahss-ls': 132000,         // Chair, Liberal Studies
  'cahss-vpa': 140000,        // Chair, Visual & Performing Arts

  // === Education Department Chairs (Level 4) ===
  'coed-ep': 145000,          // Chair, Educator Preparation
  'coed-coun': 142000,        // Chair, Counseling
  'coed-lsae': 140000,        // Chair, Leadership Studies & Adult Education
  'coed-ceeer': 118000,       // Director, Center for Educational Engagement & Research

  // === Health & Human Sciences Department Chairs/Directors (Level 4) ===
  'chhs-nurs': 168000,        // Director, School of Nursing (high demand)
  'chhs-kin': 148000,         // Chair, Kinesiology
  'chhs-psych': 155000,       // Chair, Psychology
  'chhs-swas': 145000,        // Chair, Social Work & Sociology
  'chhs-csd': 152000,         // Chair, Communication Sciences & Disorders
  'chhs-pa': 165000,          // Director, Physician Assistant Studies (clinical premium)
  'chhs-phmp': 158000,        // Chair, Population Health Management & Policy

  // === Nanoscience Chairs/Directors (Level 4) ===
  'jsnn-ns': 175000,          // Chair, Nanoscience
  'jsnn-ne': 178000,          // Chair, Nanoengineering
  'jsnn-jsirt': 145000,       // Director, Institute for Research Technologies

  // === Chief of Staff Division (Level 3) ===
  'avc-admin': 165000,        // Associate Vice Chancellor, Administration

  // === Student Affairs Directors (Level 3-4) ===
  'sa-dos': 165000,           // Dean of Students (vacant — budgeted)
  'sa-conduct': 108000,       // Associate Dean / Director Student Conduct
  'sa-enroll': 120000,        // Director, Enrollment Management
  'sa-finaid': 125000,        // Director, Financial Aid & Scholarships
  'sa-housing': 115000,       // Director, Housing & Residence Life

  // === Research Division Directors (Level 3) ===
  'res-osp': 142000,          // Director, Office of Sponsored Programs
  'res-ip': 148000,           // Director, IP & Commercialization
  'res-compliance': 135000,   // Director, Research Compliance & Ethics
  'res-catm': 168000,         // Director, Center for Advanced Transportation Mobility
  'res-cta': 162000,          // Director, Center for Trustworthy AI
  'res-cyber': 165000,        // Director, Center for Cyber Defense
  'res-cert': 155000,         // Director, Center for Energy Research & Technology

  // === Business & Finance Directors (Level 3) ===
  'fin-hr': 145000,           // Director, Human Resources
  'fin-facilities': 138000,   // Director, Facilities
  'fin-police': 128000,       // Chief of Police

  // === IT Directors (Level 3) ===
  'it-cts': 105000,           // Director, Client Technology Services
  'it-infra': 145000,         // Director, Core Infrastructure & Cybersecurity
  'it-data': 138000,          // Director, Data Governance & BI
  'it-learn': 112000,         // Director, Learning Technologies

  // === University Advancement Directors (Level 3) ===
  'adv-alumni': 142000,       // AVC, Alumni Relations
  'adv-dev': 135000,          // Director, Development
  'adv-ops': 108000,          // Director, Advancement Operations

  // === Strategic Partnerships Directors (Level 3) ===
  'sp-marcom': 128000,        // Director, Strategic Marketing & Communications
  'sp-enterprises': 125000,   // Director, Campus Enterprises
  'sp-comms': 118000,         // Director, University Communications

  // === Athletics Directors (Level 3) ===
  'ath-compliance': 95000,    // Director, Athletics Compliance
  'ath-swa': 115000,          // Senior Woman Administrator
};

// Process each position by finding its salaryBand line and inserting salary + salaryYear after it.
// We need to handle two formats:
// 1. Multi-line metadata blocks (deans, VCs, chancellor) where salaryBand is on its own line
// 2. Single-line metadata blocks (department chairs, directors) where salaryBand is inline

let modifiedContent = content;
let insertions = 0;

// Strategy: For each id in the map, find the position's salaryBand occurrence and insert after it.

for (const [id, salary] of Object.entries(salaryMap)) {
  // Find the position by its id in the file
  // We need to insert `salary: XXXXX, salaryYear: 2025,` after the salaryBand value
  
  // For multi-line format: `salaryBand: 'Executive Band 1',\n`  -> add new line after
  // For single-line format: `salaryBand: 'Academic Band 2', directReports:` -> insert before directReports

  // First, find where this id appears
  const idPattern = new RegExp(`id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`);
  const idMatch = modifiedContent.match(idPattern);
  if (!idMatch) {
    console.warn(`WARNING: Could not find position id '${id}'`);
    continue;
  }
  
  // Find the salaryBand for this specific position (the one after the id match)
  const idIndex = modifiedContent.indexOf(idMatch[0]);
  const searchFrom = idIndex;
  
  // Find the next salaryBand after this id
  const afterId = modifiedContent.substring(searchFrom);
  const sbMatch = afterId.match(/salaryBand:\s*'[^']*'/);
  if (!sbMatch) {
    console.warn(`WARNING: Could not find salaryBand for id '${id}'`);
    continue;
  }
  
  const sbIndex = searchFrom + sbMatch.index;
  const sbEnd = sbIndex + sbMatch[0].length;
  
  // Check if this is multi-line or single-line format
  // Look at what comes after the salaryBand value
  const afterSb = modifiedContent.substring(sbEnd, sbEnd + 50);
  
  if (afterSb.match(/^,\s*\n/)) {
    // Multi-line format: salaryBand: 'xxx',\n  -> insert new lines after
    const commaNewline = afterSb.match(/^,\s*\n(\s*)/);
    const indent = commaNewline ? commaNewline[1] : '        ';
    const insertPoint = sbEnd + commaNewline[0].length;
    const insertText = `salary: ${salary},\n${indent}salaryYear: 2025,\n${indent}`;
    modifiedContent = modifiedContent.substring(0, insertPoint) + insertText + modifiedContent.substring(insertPoint);
    insertions++;
  } else if (afterSb.match(/^,\s*directReports/)) {
    // Single-line format: salaryBand: 'xxx', directReports: -> insert salary before directReports
    const insertPoint = sbEnd + 2; // after ", "
    const insertText = `salary: ${salary}, salaryYear: 2025, `;
    modifiedContent = modifiedContent.substring(0, insertPoint) + insertText + modifiedContent.substring(insertPoint);
    insertions++;
  } else {
    console.warn(`WARNING: Unexpected format after salaryBand for id '${id}': "${afterSb.trim().substring(0, 30)}"`);
  }
}

console.log(`\nTotal insertions: ${insertions} out of ${Object.keys(salaryMap).length} positions`);

// Write the modified file
fs.writeFileSync(filePath, modifiedContent, 'utf8');
console.log(`\nSuccessfully wrote modified data.js`);

// Verify
const verifyContent = fs.readFileSync(filePath, 'utf8');
const salaryCount = (verifyContent.match(/salary: \d+/g) || []).length;
const salaryYearCount = (verifyContent.match(/salaryYear: 2025/g) || []).length;
console.log(`Verification: Found ${salaryCount} salary entries and ${salaryYearCount} salaryYear entries`);
