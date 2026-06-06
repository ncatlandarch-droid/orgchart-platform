/* ============================================
 * ORGCHART PLATFORM — ORI AI Avatar Module
 * ============================================
 * ORI = Organizational Resource Intelligence
 * An AI advisor character that analyzes the
 * org chart data and provides contextual
 * insights, vacancy navigation, and
 * quick-action analysis chips.
 * ============================================ */

OC.ORI = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  const AVATAR_SRC = 'assets/ori-avatar.png';
  const CURRENT_YEAR = new Date().getFullYear();

  const WELCOME_MESSAGE =
    "Hi, I'm **ORI** — your Organizational Resource Intelligence advisor. " +
    "I can help you navigate NC A&T's organizational structure, identify staffing risks, " +
    "and understand position relationships. Try clicking one of the quick actions below, " +
    "or select any position in the chart.";

  const QUICK_CHIPS = [
    { id: 'vacancies',   label: 'Show Vacancies',    icon: 'users' },
    { id: 'issues',      label: 'Critical Issues',   icon: 'warning' },
    { id: 'health',      label: 'Division Health',   icon: 'shield' },
    { id: 'salary',      label: 'Salary Overview',   icon: 'chart' },
    { id: 'succession',  label: 'Succession Risks',  icon: 'target' }
  ];

  /* ── State ──────────────────────────────── */
  let panelEl = null;
  let chatArea = null;
  let inputEl = null;
  let isCollapsed = false;
  let messageHistory = [];

  /* ── Markdown-lite Parser ──────────────── */

  /**
   * Parses **bold** markers and \n into <strong> / <br>.
   * Returns a DocumentFragment.
   */
  function parseMarkdown(text) {
    const frag = document.createDocumentFragment();
    // Split on **...**
    const parts = text.split(/\*\*(.+?)\*\*/g);
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        // Odd indices are inside **...**
        frag.appendChild(el('strong', null, part));
      } else {
        // Handle line breaks
        const lines = part.split('\n');
        lines.forEach((line, li) => {
          if (li > 0) frag.appendChild(document.createElement('br'));
          if (line) frag.appendChild(document.createTextNode(line));
        });
      }
    });
    return frag;
  }

  /* ── Currency Formatter ────────────────── */

  function formatSalary(val) {
    if (val == null || isNaN(val)) return 'N/A';
    return '$' + Number(val).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  /* ── Helpers ───────────────────────────── */

  function getNodesUnder(root) {
    const result = [];
    function walk(node) {
      result.push(node);
      if (node.children) node.children.forEach(walk);
    }
    walk(root);
    return result;
  }

  function getNodeSalary(node) {
    if (!node || !node.metadata) return null;
    if (node.metadata.salary != null) return Number(node.metadata.salary);
    return null;
  }

  /* ── Message Rendering ─────────────────── */

  function addMessage(text, sender, extras) {
    if (!chatArea) return;

    const isOri = sender === 'ori';
    const msgEl = el('div', { class: 'ori-msg ' + (isOri ? 'ori' : 'user') });

    // Text content
    const textEl = el('div', { class: 'ori-msg-text' });
    textEl.appendChild(parseMarkdown(text));
    msgEl.appendChild(textEl);

    // Optional extras (clickable vacancy items, salary bars, etc.)
    if (extras && extras.length > 0) {
      const extrasContainer = el('div', { class: 'ori-msg-extras' });
      extras.forEach(extra => extrasContainer.appendChild(extra));
      msgEl.appendChild(extrasContainer);
    }

    chatArea.appendChild(msgEl);
    messageHistory.push({ text, sender });

    // Scroll to bottom
    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  }

  function addTypingIndicator() {
    if (!chatArea) return null;
    const typing = el('div', { class: 'ori-msg ori ori-typing' },
      el('span', { class: 'ori-typing-dot' }),
      el('span', { class: 'ori-typing-dot' }),
      el('span', { class: 'ori-typing-dot' })
    );
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;
    return typing;
  }

  function simulateTyping(text, sender, extras) {
    const typing = addTypingIndicator();
    setTimeout(() => {
      if (typing && typing.parentNode) typing.remove();
      addMessage(text, sender, extras);
    }, 400 + Math.min(text.length * 2, 800));
  }

  /* ── Vacancy Item (clickable) ──────────── */

  function createVacancyItem(node) {
    const deptColor = Store.getDeptColor(node.department);
    const item = el('button', { class: 'ori-vacancy-item', dataset: { id: node.id } },
      el('span', { class: 'ori-vacancy-dot', style: { backgroundColor: deptColor } }),
      el('span', { class: 'ori-vacancy-title' }, node.title),
      el('span', { class: 'ori-vacancy-dept' }, node.division || node.department || '')
    );

    item.addEventListener('click', () => navigateToNode(node.id));
    return item;
  }

  /* ── Navigate to Node ──────────────────── */

  function navigateToNode(nodeId) {
    Store.select(nodeId);
    Store.expandToNode(nodeId);

    // Switch to chart view if not already
    if (Store.getState().currentView !== 'chart') {
      Events.emit('view:switchTo', 'chart');
    }

    requestAnimationFrame(() => {
      if (OC.TreeView && OC.TreeView.refresh) OC.TreeView.refresh();
      if (OC.ChartView && OC.ChartView.refresh) OC.ChartView.refresh();
      if (OC.PositionCard && OC.PositionCard.refresh) OC.PositionCard.refresh();
    });
  }

  /* ── Salary Bar (mini visualization) ──── */

  function createSalaryBar(label, value, maxValue, color) {
    const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    return el('div', { class: 'ori-salary-bar' },
      el('div', { class: 'ori-salary-bar-label' }, label),
      el('div', { class: 'ori-salary-bar-track' },
        el('div', {
          class: 'ori-salary-bar-fill',
          style: { width: pct + '%', background: color || 'var(--accent)' }
        })
      ),
      el('div', { class: 'ori-salary-bar-value' }, formatSalary(value))
    );
  }

  /* ═══════════════════════════════════════════
   *  REPORT GENERATORS
   * ═══════════════════════════════════════════ */

  /* ── 1. Vacancy Report ─────────────────── */

  function generateVacancyReport() {
    const nodes = Store.flattenTree();
    if (!nodes || nodes.length === 0) {
      return { text: 'No organizational data is currently loaded.', extras: [] };
    }

    const vacancies = nodes.filter(n => n.status === 'vacant');
    const interims = nodes.filter(n => n.status === 'interim');

    if (vacancies.length === 0 && interims.length === 0) {
      return { text: 'Great news — there are currently **no vacant or interim** positions in the organization.', extras: [] };
    }

    let msg = `I found **${vacancies.length} vacant** and **${interims.length} interim** positions:\n\n`;

    const extras = [];

    if (vacancies.length > 0) {
      msg += '**Vacant Positions:**\n';
      vacancies.forEach(v => {
        msg += `• ${v.title} — ${v.division || v.department || 'Unknown'}\n`;
        extras.push(createVacancyItem(v));
      });
    }

    if (interims.length > 0) {
      msg += '\n**Interim Positions:**\n';
      interims.forEach(v => {
        const holder = v.holder && v.holder.name ? v.holder.name : 'Unknown';
        msg += `• ${v.title} — ${holder} (interim)\n`;
        extras.push(createVacancyItem(v));
      });
    }

    return { text: msg, extras };
  }

  /* ── 2. Critical Issues Report ─────────── */

  function generateCriticalIssuesReport() {
    if (!OC.Analysis || !OC.Analysis.runAnalysis) {
      return { text: 'The Analysis module is not available. Please ensure it is loaded.', extras: [] };
    }

    const findings = OC.Analysis.runAnalysis();
    const critical = findings.filter(f => f.severity === 'critical');
    const warnings = findings.filter(f => f.severity === 'warning');

    if (critical.length === 0 && warnings.length === 0) {
      return { text: 'No critical issues or warnings detected. The organization appears healthy.', extras: [] };
    }

    let msg = `I identified **${critical.length} critical** issues and **${warnings.length} warnings**:\n\n`;

    if (critical.length > 0) {
      msg += '**🔴 Critical Issues:**\n';
      critical.forEach(f => {
        msg += `• ${f.title}\n`;
      });
    }

    if (warnings.length > 0) {
      msg += '\n**🟡 Warnings:**\n';
      warnings.slice(0, 8).forEach(f => {
        msg += `• ${f.title}\n`;
      });
      if (warnings.length > 8) {
        msg += `• ...and ${warnings.length - 8} more warnings.\n`;
      }
    }

    msg += '\nSwitch to the **Analysis** view for the full intelligence report.';

    // Create clickable extras for critical nodes
    const extras = [];
    critical.forEach(f => {
      if (f.affectedNodes && f.affectedNodes.length > 0) {
        f.affectedNodes.slice(0, 3).forEach(nodeId => {
          const node = Store.findNode(nodeId);
          if (node) extras.push(createVacancyItem(node));
        });
      }
    });

    return { text: msg, extras };
  }

  /* ── 3. Division Health Report ─────────── */

  function generateDivisionHealthReport() {
    const data = Store.getData();
    if (!data || !data.children) {
      return { text: 'No organizational data available.', extras: [] };
    }

    const divisions = data.children;
    let msg = `**Division Health Overview** (${divisions.length} divisions):\n\n`;

    const extras = [];

    divisions.forEach(divNode => {
      const members = getNodesUnder(divNode);
      const total = members.length;
      const filled = members.filter(n => n.status === 'filled').length;
      const vacant = members.filter(n => n.status === 'vacant').length;
      const interim = members.filter(n => n.status === 'interim').length;
      const fillRate = total > 0 ? Math.round((filled / total) * 100) : 0;

      const divName = divNode.division || divNode.title;
      const statusEmoji = fillRate >= 80 ? '🟢' : fillRate >= 60 ? '🟡' : '🔴';

      msg += `${statusEmoji} **${divName}** — ${fillRate}% filled (${filled}/${total})\n`;
      if (vacant > 0) msg += `   ${vacant} vacant`;
      if (interim > 0) msg += `${vacant > 0 ? ', ' : '   '}${interim} interim`;
      msg += '\n';

      // Create salary bars as extras
      const color = Store.getDeptColor(divName);
      extras.push(createSalaryBar(divName, fillRate, 100, color));
    });

    return { text: msg, extras };
  }

  /* ── 4. Salary Overview Report ─────────── */

  function generateSalaryOverview() {
    const nodes = Store.flattenTree();
    if (!nodes || nodes.length === 0) {
      return { text: 'No organizational data available.', extras: [] };
    }

    // Gather salary data
    const withSalary = nodes.filter(n => getNodeSalary(n) !== null);

    if (withSalary.length === 0) {
      // Try salaryBand instead
      const withBand = nodes.filter(n => n.metadata && n.metadata.salaryBand);
      if (withBand.length === 0) {
        return { text: 'No salary data is available in the current dataset. Salary information may need to be added to position metadata.', extras: [] };
      }

      // Group by salary band
      const bands = {};
      withBand.forEach(n => {
        const band = n.metadata.salaryBand;
        if (!bands[band]) bands[band] = 0;
        bands[band]++;
      });

      let msg = `**Salary Band Distribution** (${withBand.length} positions with band data):\n\n`;
      Object.entries(bands).sort((a, b) => b[1] - a[1]).forEach(([band, count]) => {
        msg += `• **${band}**: ${count} position${count !== 1 ? 's' : ''}\n`;
      });

      return { text: msg, extras: [] };
    }

    // Compute stats
    const salaries = withSalary.map(n => getNodeSalary(n));
    const total = salaries.reduce((s, v) => s + v, 0);
    const avg = Math.round(total / salaries.length);
    const sorted = [...salaries].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    let msg = `**Salary Overview** (${withSalary.length} positions with salary data):\n\n`;
    msg += `• Average: **${formatSalary(avg)}**\n`;
    msg += `• Median: **${formatSalary(median)}**\n`;
    msg += `• Range: ${formatSalary(min)} — ${formatSalary(max)}\n\n`;

    // Group by level
    const byLevel = {};
    withSalary.forEach(n => {
      const lvl = 'Level ' + (n.level != null ? n.level : 'Unknown');
      if (!byLevel[lvl]) byLevel[lvl] = [];
      byLevel[lvl].push(getNodeSalary(n));
    });

    msg += '**By Level:**\n';
    const extras = [];

    Object.entries(byLevel)
      .sort((a, b) => {
        const aNum = parseInt(a[0].replace('Level ', ''), 10) || 99;
        const bNum = parseInt(b[0].replace('Level ', ''), 10) || 99;
        return aNum - bNum;
      })
      .forEach(([lvl, sals]) => {
        const levelAvg = Math.round(sals.reduce((s, v) => s + v, 0) / sals.length);
        msg += `• ${lvl}: ${formatSalary(levelAvg)} avg (${sals.length} position${sals.length !== 1 ? 's' : ''})\n`;
        extras.push(createSalaryBar(lvl, levelAvg, max, 'var(--accent)'));
      });

    return { text: msg, extras };
  }

  /* ── 5. Succession Risks Report ────────── */

  function generateSuccessionRisks() {
    const nodes = Store.flattenTree();
    if (!nodes || nodes.length === 0) {
      return { text: 'No organizational data available.', extras: [] };
    }

    const atRisk = nodes.filter(n => {
      if (n.level > 3) return false;
      if (!n.holder || !n.holder.since) return false;
      const since = parseInt(n.holder.since, 10);
      if (isNaN(since)) return false;
      return (CURRENT_YEAR - since) >= 5;
    });

    if (atRisk.length === 0) {
      return { text: 'No significant succession risks identified. All leadership positions (levels 1–3) have holders with fewer than 5 years of tenure.', extras: [] };
    }

    // Sort by tenure descending
    atRisk.sort((a, b) => {
      const aSince = parseInt(a.holder.since, 10);
      const bSince = parseInt(b.holder.since, 10);
      return aSince - bSince; // Longest tenure first
    });

    let msg = `**Succession Risk Analysis** — ${atRisk.length} position${atRisk.length !== 1 ? 's' : ''} with extended tenure:\n\n`;

    const extras = [];

    atRisk.forEach(n => {
      const tenure = CURRENT_YEAR - parseInt(n.holder.since, 10);
      const riskLevel = tenure >= 10 ? '🔴' : tenure >= 7 ? '🟡' : '🟢';
      msg += `${riskLevel} **${n.title}** — ${n.holder.name} (${tenure} years)\n`;
      msg += `   Level ${n.level} · ${n.division || n.department || ''}\n`;
      extras.push(createVacancyItem(n));
    });

    msg += '\nPositions with long-tenured holders should have active succession plans to mitigate transition risk.';

    return { text: msg, extras };
  }

  /* ── Handle Chip Action ────────────────── */

  function handleChipAction(chipId) {
    // Add user message
    const chip = QUICK_CHIPS.find(c => c.id === chipId);
    if (chip) addMessage(chip.label, 'user');

    let result;
    switch (chipId) {
      case 'vacancies':   result = generateVacancyReport(); break;
      case 'issues':      result = generateCriticalIssuesReport(); break;
      case 'health':      result = generateDivisionHealthReport(); break;
      case 'salary':      result = generateSalaryOverview(); break;
      case 'succession':  result = generateSuccessionRisks(); break;
      default:
        result = { text: "I don't recognize that action. Try one of the quick action chips.", extras: [] };
    }

    simulateTyping(result.text, 'ori', result.extras);
  }

  /* ── Handle Free Text Input ────────────── */

  function handleUserInput(text) {
    if (!text || !text.trim()) return;

    addMessage(text.trim(), 'user');

    // Simple keyword matching for free-text queries
    const lower = text.toLowerCase();
    let result = null;

    if (lower.includes('vacan') || lower.includes('open position') || lower.includes('unfilled')) {
      result = generateVacancyReport();
    } else if (lower.includes('critical') || lower.includes('issue') || lower.includes('problem') || lower.includes('risk')) {
      result = generateCriticalIssuesReport();
    } else if (lower.includes('health') || lower.includes('division') || lower.includes('department')) {
      result = generateDivisionHealthReport();
    } else if (lower.includes('salary') || lower.includes('pay') || lower.includes('compensation') || lower.includes('wage')) {
      result = generateSalaryOverview();
    } else if (lower.includes('succession') || lower.includes('tenure') || lower.includes('retire') || lower.includes('long-term')) {
      result = generateSuccessionRisks();
    } else {
      // Search for a position or person
      const nodes = Store.flattenTree() || [];
      const matches = nodes.filter(n =>
        n.title.toLowerCase().includes(lower) ||
        (n.holder && n.holder.name && n.holder.name.toLowerCase().includes(lower)) ||
        (n.department && n.department.toLowerCase().includes(lower))
      );

      if (matches.length > 0) {
        let msg = `I found **${matches.length}** matching position${matches.length !== 1 ? 's' : ''}:\n\n`;
        const extras = [];
        matches.slice(0, 10).forEach(n => {
          const holder = n.holder && n.holder.name ? n.holder.name : 'Vacant';
          msg += `• **${n.title}** — ${holder}\n`;
          extras.push(createVacancyItem(n));
        });
        if (matches.length > 10) {
          msg += `\n...and ${matches.length - 10} more. Use the search bar for full results.`;
        }
        result = { text: msg, extras };
      } else {
        result = {
          text: "I couldn't match that to a specific analysis or position. Try one of the quick actions, or ask about **vacancies**, **salary**, **division health**, **succession risks**, or **critical issues**.",
          extras: []
        };
      }
    }

    simulateTyping(result.text, 'ori', result.extras);
  }

  /* ── Context Awareness (Node Selection) ── */

  function onNodeSelected(node) {
    if (!node || !panelEl || isCollapsed) return;

    let msg = '';
    const extras = [];

    if (node.status === 'vacant') {
      // Count division vacancies
      const allNodes = Store.flattenTree() || [];
      const divVacancies = allNodes.filter(
        n => n.status === 'vacant' && (n.division || '') === (node.division || '')
      );
      msg = `This position (**${node.title}**) is currently **vacant**.`;
      if (node.division) {
        msg += ` ${node.division} has **${divVacancies.length}** total vacanc${divVacancies.length !== 1 ? 'ies' : 'y'}.`;
      }
      if (node.department) msg += ` Department: ${node.department}.`;

    } else if (node.status === 'interim') {
      const holder = node.holder && node.holder.name ? node.holder.name : 'Unknown';
      msg = `**${holder}** is serving in an **interim** capacity as ${node.title}.`;
      if (node.holder && node.holder.since) {
        const tenure = CURRENT_YEAR - parseInt(node.holder.since, 10);
        if (!isNaN(tenure)) msg += ` Interim period: ${tenure} year${tenure !== 1 ? 's' : ''}.`;
      }

    } else {
      // Filled position
      const holder = node.holder && node.holder.name ? node.holder.name : null;
      if (holder) {
        msg = `**${holder}** holds the **${node.title}** position.`;
        if (node.holder.since) {
          const tenure = CURRENT_YEAR - parseInt(node.holder.since, 10);
          if (!isNaN(tenure)) msg += ` Tenure: ${tenure} year${tenure !== 1 ? 's' : ''} (since ${node.holder.since}).`;
        }
      } else {
        msg = `**${node.title}** — ${node.status || 'filled'}.`;
      }

      // Direct reports
      const directReports = node.children ? node.children.length : 0;
      if (directReports > 0) {
        msg += ` Oversees **${directReports}** direct report${directReports !== 1 ? 's' : ''}.`;
      }
    }

    // Salary info
    const salary = getNodeSalary(node);
    if (salary !== null) {
      msg += ` Salary: **${formatSalary(salary)}**.`;
    } else if (node.metadata && node.metadata.salaryBand) {
      msg += ` Salary band: **${node.metadata.salaryBand}**.`;
    }

    if (msg) {
      simulateTyping(msg, 'ori', extras);
    }
  }

  /* ═══════════════════════════════════════════
   *  PANEL RENDERING
   * ═══════════════════════════════════════════ */

  function renderPanel() {
    // Find the sidebar container
    const sidebar = Utils.$('.sidebar') || Utils.$('#sidebar');
    if (!sidebar) return;

    // Remove existing panel if re-rendering
    const existing = Utils.$('.ori-panel', sidebar);
    if (existing) existing.remove();

    // Build panel — EMMA-style: avatar at TOP of sidebar, not bottom
    panelEl = el('div', { class: 'ori-panel' + (isCollapsed ? ' collapsed' : '') });

    // ── Avatar Section (EMMA pattern — primary, at top) ──
    const avatarSection = el('div', { class: 'ori-avatar-section' });

    const avatarWrap = el('div', { class: 'ori-avatar-wrapper', title: 'Click to hear ORI speak' });
    avatarWrap.appendChild(createAvatar());
    avatarSection.appendChild(avatarWrap);

    // Name + role below avatar (EMMA style)
    const nameBlock = el('div', { class: 'ori-name-block' });
    nameBlock.appendChild(el('div', { class: 'ori-name' }, 'ORI'));
    nameBlock.appendChild(el('div', { class: 'ori-role' }, 'Organizational Resource Intelligence'));
    avatarSection.appendChild(nameBlock);

    panelEl.appendChild(avatarSection);

    // ── Chat Section ──
    const chatSection = el('div', { class: 'ori-chat-section' + (isCollapsed ? ' collapsed' : '') });

    // Chat area
    chatArea = el('div', { class: 'ori-chat-area' });
    chatSection.appendChild(chatArea);

    // Quick chips
    const chipsRow = el('div', { class: 'ori-chips' });
    QUICK_CHIPS.forEach(chip => {
      const chipBtn = el('button', { class: 'ori-chip', dataset: { action: chip.id } },
        el('span', { class: 'ori-chip-icon', innerHTML: Icons[chip.icon] ? Icons[chip.icon](12) : '' }),
        chip.label
      );
      chipBtn.addEventListener('click', () => handleChipAction(chip.id));
      chipsRow.appendChild(chipBtn);
    });
    chatSection.appendChild(chipsRow);

    // Input area
    const inputArea = el('div', { class: 'ori-input-area' });
    inputEl = el('input', {
      class: 'ori-input',
      type: 'text',
      placeholder: 'Ask ORI something...',
      autocomplete: 'off'
    });
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitInput();
      }
    });

    const sendBtn = el('button', {
      class: 'ori-send-btn',
      title: 'Send',
      innerHTML: Icons.arrowUp(14)
    });
    sendBtn.addEventListener('click', submitInput);

    inputArea.appendChild(inputEl);
    inputArea.appendChild(sendBtn);
    chatSection.appendChild(inputArea);

    panelEl.appendChild(chatSection);

    // ── Tree Navigation Panel (collapsible) ──
    const treeNavSection = el('div', { class: 'ori-tree-nav-section' });
    const treeNavToggle = el('button', { class: 'ori-tree-nav-toggle' });
    treeNavToggle.innerHTML = Icons.network(14) + ' <span>Org Navigator</span> <span class="ori-tree-nav-arrow">▾</span>';
    let treeNavOpen = false;
    const treeNavList = el('div', { class: 'ori-tree-nav-list', style: { display: 'none' } });

    function buildTreeNav() {
      treeNavList.innerHTML = '';
      const data = Store.getData();
      if (!data) return;

      // Root node
      const rootItem = el('button', { class: 'ori-tree-nav-item root' });
      rootItem.textContent = data.title;
      rootItem.addEventListener('click', () => navigateToNode(data.id));
      treeNavList.appendChild(rootItem);

      // Top-level children (divisions)
      if (data.children) {
        data.children.forEach(div => {
          const divColor = Store.getDeptColor(div.department || div.division || div.title);
          const divItem = el('button', { class: 'ori-tree-nav-item division' });
          divItem.innerHTML = '<span class="ori-tree-nav-dot" style="background:' + divColor + '"></span> ' + div.title;
          divItem.addEventListener('click', () => navigateToNode(div.id));
          treeNavList.appendChild(divItem);

          // Sub-children (colleges/units)
          if (div.children) {
            div.children.forEach(sub => {
              const subItem = el('button', { class: 'ori-tree-nav-item sub' });
              const subColor = Store.getDeptColor(sub.department || sub.division || '');
              subItem.innerHTML = '<span class="ori-tree-nav-dot" style="background:' + subColor + '"></span> ' + sub.title;
              subItem.addEventListener('click', () => navigateToNode(sub.id));
              treeNavList.appendChild(subItem);
            });
          }
        });
      }
    }

    treeNavToggle.addEventListener('click', () => {
      treeNavOpen = !treeNavOpen;
      treeNavList.style.display = treeNavOpen ? 'block' : 'none';
      treeNavToggle.querySelector('.ori-tree-nav-arrow').textContent = treeNavOpen ? '▴' : '▾';
      if (treeNavOpen) buildTreeNav();
    });

    treeNavSection.appendChild(treeNavToggle);
    treeNavSection.appendChild(treeNavList);
    panelEl.appendChild(treeNavSection);

    // INSERT at TOP of sidebar (before tree view) — like EMMA
    sidebar.prepend(panelEl);
  }

  function createAvatar() {
    const img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'ORI Avatar';
    img.className = 'ori-avatar-img';
    img.draggable = false;
    img.onerror = function() {
      // Fallback: render initials circle
      const fallback = el('div', { class: 'ori-avatar-fallback' }, 'ORI');
      this.replaceWith(fallback);
    };
    return img;
  }

  function createAvatarMini() {
    const img = document.createElement('img');
    img.src = AVATAR_SRC;
    img.alt = 'ORI';
    img.className = 'ori-avatar-mini';
    img.draggable = false;
    img.onerror = function() {
      const fallback = el('span', { class: 'ori-avatar-mini-fallback' }, 'O');
      this.replaceWith(fallback);
    };
    return img;
  }

  /* ── Submit Input ──────────────────────── */

  function submitInput() {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    handleUserInput(text);
  }

  /* ── Toggle Panel ──────────────────────── */

  function togglePanel() {
    isCollapsed = !isCollapsed;
    if (panelEl) {
      panelEl.classList.toggle('collapsed', isCollapsed);
    }
  }

  /* ── Welcome Message ───────────────────── */

  function addWelcomeMessage() {
    if (!chatArea) return;
    addMessage(WELCOME_MESSAGE, 'ori');
  }

  /* ── Data Changed Handler ──────────────── */

  function onDataChanged() {
    // Optionally add a subtle notice
    // (Only if panel is visible and has been used)
    if (!panelEl || isCollapsed || messageHistory.length <= 1) return;
    addMessage('Organizational data has been updated. My analysis will reflect the latest changes.', 'ori');
  }

  /* ── Public API ────────────────────────── */

  return {
    init() {
      renderPanel();
      addWelcomeMessage();
      Events.on('store:selected', onNodeSelected);
      Events.on('store:dataChanged', onDataChanged);
    },
    refresh: renderPanel,
    toggle: togglePanel
  };
})();
