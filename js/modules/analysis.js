/* ============================================
 * ORGCHART PLATFORM — AI Analysis Module
 * ============================================
 * Automated organizational intelligence that
 * scans the hierarchy and produces findings
 * across 8 insight categories.
 * ============================================ */

OC.Analysis = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  const CURRENT_YEAR = new Date().getFullYear();

  /* ── Helpers ────────────────────────────── */

  function getNodeDepth(node, depth) {
    if (!node.children || node.children.length === 0) return depth;
    let max = depth;
    node.children.forEach(c => {
      max = Math.max(max, getNodeDepth(c, depth + 1));
    });
    return max;
  }

  function getDivisionNodes(allNodes) {
    return allNodes.filter(n => n.level === 2);
  }

  function getNodesUnder(root) {
    const result = [];
    function walk(node) {
      result.push(node);
      if (node.children) node.children.forEach(walk);
    }
    walk(root);
    return result;
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function pct(num, den) {
    return den === 0 ? 0 : Math.round((num / den) * 100);
  }

  function severityOrder(s) {
    if (s === 'critical') return 0;
    if (s === 'warning') return 1;
    return 2;
  }

  function severityColor(s) {
    if (s === 'critical') return 'var(--status-vacant, #ef4444)';
    if (s === 'warning') return 'var(--status-interim, #f59e0b)';
    return 'var(--primary, #3b82f6)';
  }

  function severityIcon(s) {
    if (s === 'critical') return Icons.warning(16);
    if (s === 'warning') return Icons.warning(16);
    return Icons.info(16);
  }

  /* ── Analysis Engine ───────────────────── */

  function runAnalysis() {
    const allNodes = Store.flattenTree();
    if (!allNodes || allNodes.length === 0) return [];

    const findings = [];

    analyzeVacancyRisk(allNodes, findings);
    analyzeInterimInstability(allNodes, findings);
    analyzeSpanOfControl(allNodes, findings);
    analyzeSinglePointOfFailure(allNodes, findings);
    analyzeDepthImbalance(allNodes, findings);
    analyzeCompetencyGaps(allNodes, findings);
    analyzeDivisionHealth(allNodes, findings);
    analyzeSuccessionReadiness(allNodes, findings);

    // Sort by severity
    findings.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

    return findings;
  }

  /* ── 1. Vacancy Risk ───────────────────── */

  function analyzeVacancyRisk(allNodes, findings) {
    const vacant = allNodes.filter(n => n.status === 'vacant');
    if (vacant.length === 0) return;

    // Group by division
    const byDivision = {};
    vacant.forEach(n => {
      const div = n.division || 'Unknown';
      if (!byDivision[div]) byDivision[div] = [];
      byDivision[div].push(n);
    });

    // Executive vacancies (level <= 2)
    const execVacant = vacant.filter(n => n.level <= 2);
    if (execVacant.length > 0) {
      findings.push({
        type: 'vacancy_risk',
        severity: 'critical',
        title: 'Executive Vacancy — Immediate Action Required',
        description: execVacant.length + ' executive-level position' +
          (execVacant.length > 1 ? 's are' : ' is') +
          ' vacant. These leadership gaps can cascade through the entire organization and impair strategic decision-making.',
        affectedNodes: execVacant.map(n => n.id),
        metric: execVacant.length,
        division: null
      });
    }

    // Division-level vacancy summaries
    Object.keys(byDivision).forEach(div => {
      const nodes = byDivision[div];
      const divTotal = allNodes.filter(n => (n.division || 'Unknown') === div).length;
      const rate = pct(nodes.length, divTotal);

      findings.push({
        type: 'vacancy_risk',
        severity: rate > 30 ? 'critical' : 'warning',
        title: div + ' — ' + nodes.length + ' Vacant Position' + (nodes.length > 1 ? 's' : '') + ' (' + rate + '%)',
        description: nodes.length + ' of ' + divTotal + ' positions in ' + div +
          ' are unfilled (' + rate + '% vacancy rate).' +
          (rate > 30 ? ' This exceeds the critical 30% threshold.' : ''),
        affectedNodes: nodes.map(n => n.id),
        metric: rate,
        division: div
      });
    });
  }

  /* ── 2. Interim Instability ────────────── */

  function analyzeInterimInstability(allNodes, findings) {
    const interim = allNodes.filter(n => n.status === 'interim');
    if (interim.length === 0) return;

    interim.forEach(n => {
      const sinceYear = n.holder && n.holder.since ? parseInt(n.holder.since, 10) : null;
      const duration = sinceYear ? CURRENT_YEAR - sinceYear : null;
      const isLong = duration !== null && duration > 1;

      findings.push({
        type: 'interim_instability',
        severity: isLong ? 'warning' : 'info',
        title: n.title + ' — Interim' + (duration !== null ? ' (' + duration + ' year' + (duration !== 1 ? 's' : '') + ')' : ''),
        description: (n.holder && n.holder.name ? n.holder.name : 'Unknown') +
          ' is serving in an interim capacity as ' + n.title + '.' +
          (isLong ? ' This interim appointment has exceeded 1 year, suggesting difficulty filling the role permanently.' : '') +
          (n.division ? ' Division: ' + n.division + '.' : ''),
        affectedNodes: [n.id],
        metric: duration,
        division: n.division || null
      });
    });
  }

  /* ── 3. Span of Control ────────────────── */

  function analyzeSpanOfControl(allNodes, findings) {
    const withChildren = allNodes.filter(n => n.children && n.children.length > 0);
    if (withChildren.length === 0) return;

    const spans = withChildren.map(n => n.children.length);
    const avgSpan = Math.round(spans.reduce((a, b) => a + b, 0) / spans.length * 10) / 10;

    const outliers = withChildren.filter(n => n.children.length > 8);
    if (outliers.length === 0) return;

    outliers.forEach(n => {
      findings.push({
        type: 'span_of_control',
        severity: 'warning',
        title: n.title + ' — ' + n.children.length + ' Direct Reports',
        description: (n.holder && n.holder.name ? n.holder.name : n.title) +
          ' manages ' + n.children.length + ' direct reports, well above the organizational average of ' +
          avgSpan + '. Research suggests optimal span of control is 5-8 reports. Consider restructuring or adding intermediate management layers.',
        affectedNodes: [n.id],
        metric: n.children.length,
        division: n.division || null
      });
    });
  }

  /* ── 4. Single Point of Failure ────────── */

  function analyzeSinglePointOfFailure(allNodes, findings) {
    const critical = allNodes.filter(n =>
      n.level <= 2 && (!n.children || n.children.length <= 1)
    );
    if (critical.length === 0) return;

    critical.forEach(n => {
      const childCount = n.children ? n.children.length : 0;
      findings.push({
        type: 'single_point_of_failure',
        severity: 'critical',
        title: n.title + ' — No Succession Depth',
        description: 'This level ' + n.level + ' position has ' +
          (childCount === 0 ? 'no direct reports' : 'only 1 direct report') +
          ', creating a single point of failure. If this role becomes vacant, there is insufficient organizational depth to absorb responsibilities.' +
          (n.holder && n.holder.name ? ' Current holder: ' + n.holder.name + '.' : ''),
        affectedNodes: [n.id],
        metric: childCount,
        division: n.division || null
      });
    });
  }

  /* ── 5. Depth Imbalance ────────────────── */

  function analyzeDepthImbalance(allNodes, findings) {
    const data = Store.getData();
    if (!data || !data.children) return;

    const divNodes = data.children;
    if (divNodes.length < 2) return;

    const divDepths = divNodes.map(d => ({
      node: d,
      depth: getNodeDepth(d, 0)
    }));

    const avgDepth = divDepths.reduce((s, d) => s + d.depth, 0) / divDepths.length;

    divDepths.forEach(d => {
      const diff = Math.abs(d.depth - avgDepth);
      if (diff >= 2) {
        const direction = d.depth > avgDepth ? 'deeper' : 'shallower';
        findings.push({
          type: 'depth_imbalance',
          severity: 'info',
          title: d.node.title + ' — Structural Depth ' + (direction === 'deeper' ? 'Excess' : 'Deficit'),
          description: (d.node.division || d.node.title) + ' has a hierarchy depth of ' + d.depth +
            ' levels, which is ' + Math.round(diff * 10) / 10 + ' levels ' + direction +
            ' than the organizational average of ' + Math.round(avgDepth * 10) / 10 +
            '. This may indicate ' + (direction === 'deeper' ? 'over-layering and bureaucratic overhead' : 'insufficient management structure') + '.',
          affectedNodes: [d.node.id],
          metric: d.depth,
          division: d.node.division || d.node.title
        });
      }
    });
  }

  /* ── 6. Competency Gaps ────────────────── */

  function analyzeCompetencyGaps(allNodes, findings) {
    const gaps = allNodes.filter(n => {
      const meta = n.metadata || {};
      return !meta.competencies || meta.competencies.length < 3;
    });

    if (gaps.length === 0) return;

    // Group by division
    const byDivision = {};
    gaps.forEach(n => {
      const div = n.division || 'Unknown';
      if (!byDivision[div]) byDivision[div] = [];
      byDivision[div].push(n);
    });

    Object.keys(byDivision).forEach(div => {
      const nodes = byDivision[div];
      const divTotal = allNodes.filter(n => (n.division || 'Unknown') === div).length;
      const rate = pct(nodes.length, divTotal);

      findings.push({
        type: 'competency_gap',
        severity: rate > 50 ? 'warning' : 'info',
        title: div + ' — ' + nodes.length + ' Position' + (nodes.length > 1 ? 's' : '') + ' Need Competency Mapping',
        description: nodes.length + ' of ' + divTotal + ' positions in ' + div +
          ' have fewer than 3 documented competencies (' + rate + '%). ' +
          'Complete competency profiles are essential for succession planning, recruitment, and performance evaluation.',
        affectedNodes: nodes.map(n => n.id),
        metric: rate,
        division: div
      });
    });
  }

  /* ── 7. Division Health Score ───────────── */

  function analyzeDivisionHealth(allNodes, findings) {
    const data = Store.getData();
    if (!data || !data.children) return;

    data.children.forEach(divNode => {
      const members = getNodesUnder(divNode);
      const total = members.length;
      if (total === 0) return;

      const filled = members.filter(n => n.status === 'filled').length;
      const vacant = members.filter(n => n.status === 'vacant').length;
      const interim = members.filter(n => n.status === 'interim').length;

      const fillRate = filled / total;
      const vacancyRate = vacant / total;

      // Span score: penalize divisions with outlier spans
      const managers = members.filter(n => n.children && n.children.length > 0);
      let spanScore = 1;
      if (managers.length > 0) {
        const avgSpan = managers.reduce((s, n) => s + n.children.length, 0) / managers.length;
        spanScore = avgSpan <= 8 ? 1 : clamp(1 - (avgSpan - 8) / 10, 0, 1);
      }

      // Depth score: middle depth is best
      const depth = getNodeDepth(divNode, 0);
      const depthScore = depth >= 2 && depth <= 5 ? 1 : clamp(1 - Math.abs(depth - 3.5) / 5, 0, 1);

      const score = Math.round(
        (fillRate * 40) +
        ((1 - vacancyRate) * 30) +
        (spanScore * 15) +
        (depthScore * 15)
      );

      let severity = 'info';
      if (score < 50) severity = 'critical';
      else if (score < 75) severity = 'warning';

      const issues = [];
      if (vacancyRate > 0.2) issues.push(Math.round(vacancyRate * 100) + '% vacancy rate');
      if (interim > 0) issues.push(interim + ' interim position' + (interim > 1 ? 's' : ''));
      if (spanScore < 0.8) issues.push('span of control concerns');

      findings.push({
        type: 'division_health',
        severity: severity,
        title: (divNode.division || divNode.title) + ' — Health Score: ' + score + '/100',
        description: 'Composite health: ' + score + '/100. ' +
          filled + ' filled, ' + vacant + ' vacant, ' + interim + ' interim of ' + total + ' total positions.' +
          (issues.length > 0 ? ' Key issues: ' + issues.join(', ') + '.' : ' No major issues detected.'),
        affectedNodes: [divNode.id],
        metric: score,
        division: divNode.division || divNode.title
      });
    });
  }

  /* ── 8. Succession Readiness ───────────── */

  function analyzeSuccessionReadiness(allNodes, findings) {
    const atRisk = allNodes.filter(n => {
      if (n.level > 3) return false;
      if (!n.holder || !n.holder.since) return false;
      const since = parseInt(n.holder.since, 10);
      return since <= 2020;
    });

    if (atRisk.length === 0) return;

    atRisk.forEach(n => {
      const since = parseInt(n.holder.since, 10);
      const tenure = CURRENT_YEAR - since;

      findings.push({
        type: 'succession_readiness',
        severity: 'info',
        title: n.title + ' — ' + tenure + '-Year Tenure',
        description: n.holder.name + ' has held this level ' + n.level +
          ' position since ' + n.holder.since + ' (' + tenure + ' years). ' +
          'Long-tenured leaders in critical positions present transition and retirement risk. ' +
          'Recommend evaluating succession pipeline and knowledge transfer plans.',
        affectedNodes: [n.id],
        metric: tenure,
        division: n.division || null
      });
    });
  }

  /* ── Compute Summary Metrics ───────────── */

  function computeSummary(allNodes, findings) {
    const stats = Store.getStats();
    const total = stats.total || allNodes.length;
    const filled = stats.filled || allNodes.filter(n => n.status === 'filled').length;
    const vacant = stats.vacant || allNodes.filter(n => n.status === 'vacant').length;
    const interim = stats.interim || allNodes.filter(n => n.status === 'interim').length;

    const filledPct = pct(filled, total);

    // Leadership stability: % of level <= 3 that are filled (not interim or vacant)
    const leaders = allNodes.filter(n => n.level <= 3);
    const stableLeaders = leaders.filter(n => n.status === 'filled');
    const leadershipPct = pct(stableLeaders.length, leaders.length);

    // Vacancy risk: inverse of vacancy rate, scaled
    const vacancyRiskScore = Math.round(100 - (vacant / total) * 100);

    // Overall health: average of division health scores
    const healthFindings = findings.filter(f => f.type === 'division_health');
    const overallHealth = healthFindings.length > 0
      ? Math.round(healthFindings.reduce((s, f) => s + (f.metric || 0), 0) / healthFindings.length)
      : filledPct;

    return {
      filledPct,
      leadershipPct,
      vacancyRiskScore,
      overallHealth,
      total,
      filled,
      vacant,
      interim
    };
  }

  /* ── Render Dashboard ──────────────────── */

  function render() {
    const panel = Utils.$('.center-panel');
    if (!panel) return;

    const allNodes = Store.flattenTree();
    if (!allNodes || allNodes.length === 0) return;

    const findings = runAnalysis();
    const summary = computeSummary(allNodes, findings);

    Utils.empty(panel);

    const container = el('div', { class: 'analysis-panel' });

    // Header
    container.appendChild(renderHeader());

    // Score cards
    container.appendChild(renderScoreCards(summary));

    // Division health table
    container.appendChild(renderDivisionHealth(allNodes, findings));

    // Findings
    container.appendChild(renderFindings(findings));

    panel.appendChild(container);
  }

  function renderHeader() {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) + ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return el('div', { class: 'analysis-header' },
      el('div', { class: 'analysis-header-top' },
        el('span', { class: 'analysis-header-icon', innerHTML: Icons.chart(20) }),
        el('h2', { class: 'analysis-header-title' }, 'Organizational Intelligence Report')
      ),
      el('div', { class: 'analysis-header-meta' },
        el('span', { class: 'analysis-timestamp' }, 'Generated: ' + timestamp),
        el('span', { class: 'analysis-org' }, CONFIG.organization.name)
      )
    );
  }

  function renderScoreCards(summary) {
    const grid = el('div', { class: 'analysis-scores' });

    const cards = [
      {
        value: summary.filledPct,
        label: 'Positions Filled',
        gradient: 'conic-gradient(#22c55e ' + (summary.filledPct * 3.6) + 'deg, #22c55e33 0deg)',
        color: '#22c55e'
      },
      {
        value: summary.leadershipPct,
        label: 'Leadership Stability',
        gradient: 'conic-gradient(#3b82f6 ' + (summary.leadershipPct * 3.6) + 'deg, #3b82f633 0deg)',
        color: '#3b82f6'
      },
      {
        value: summary.vacancyRiskScore,
        label: 'Vacancy Risk Score',
        gradient: 'conic-gradient(' + (summary.vacancyRiskScore < 70 ? '#ef4444' : '#22c55e') +
          ' ' + (summary.vacancyRiskScore * 3.6) + 'deg, ' +
          (summary.vacancyRiskScore < 70 ? '#ef444433' : '#22c55e33') + ' 0deg)',
        color: summary.vacancyRiskScore < 70 ? '#ef4444' : '#22c55e'
      },
      {
        value: summary.overallHealth,
        label: 'Overall Health Score',
        gradient: 'conic-gradient(' +
          (summary.overallHealth < 50 ? '#ef4444' : summary.overallHealth < 75 ? '#f59e0b' : '#22c55e') +
          ' ' + (summary.overallHealth * 3.6) + 'deg, ' +
          (summary.overallHealth < 50 ? '#ef444433' : summary.overallHealth < 75 ? '#f59e0b33' : '#22c55e33') +
          ' 0deg)',
        color: summary.overallHealth < 50 ? '#ef4444' : summary.overallHealth < 75 ? '#f59e0b' : '#22c55e'
      }
    ];

    cards.forEach(card => {
      const scoreCard = el('div', { class: 'score-card' },
        el('div', { class: 'score-ring', style: { background: card.gradient } },
          el('div', { class: 'score-ring-inner' },
            el('div', { class: 'score-value', style: { color: card.color } }, card.value + '%')
          )
        ),
        el('div', { class: 'score-label' }, card.label)
      );
      grid.appendChild(scoreCard);
    });

    return grid;
  }

  function renderDivisionHealth(allNodes, findings) {
    const section = el('div', { class: 'division-health' });

    section.appendChild(
      el('h3', { class: 'analysis-section-title' },
        el('span', { class: 'analysis-section-icon', innerHTML: Icons.briefcase(16) }),
        'Division Health Overview'
      )
    );

    // Table header
    const header = el('div', { class: 'division-row division-row-header' },
      el('div', { class: 'division-col division-col-name' }, 'Division'),
      el('div', { class: 'division-col division-col-bar' }, 'Health Score'),
      el('div', { class: 'division-col division-col-stat' }, 'Filled'),
      el('div', { class: 'division-col division-col-stat' }, 'Vacant'),
      el('div', { class: 'division-col division-col-stat' }, 'Interim'),
      el('div', { class: 'division-col division-col-stat' }, 'Issues')
    );
    section.appendChild(header);

    // Get division health findings
    const healthFindings = findings.filter(f => f.type === 'division_health');

    healthFindings.forEach(f => {
      const divName = f.division || 'Unknown';
      const score = f.metric || 0;
      const deptColor = Store.getDeptColor(divName);

      // Parse counts from description
      const data = Store.getData();
      let filled = 0, vacant = 0, interim = 0;

      if (data && data.children) {
        const divNode = data.children.find(c => (c.division || c.title) === divName);
        if (divNode) {
          const members = getNodesUnder(divNode);
          filled = members.filter(n => n.status === 'filled').length;
          vacant = members.filter(n => n.status === 'vacant').length;
          interim = members.filter(n => n.status === 'interim').length;
        }
      }

      // Count issues for this division
      const divIssues = findings.filter(fi =>
        fi.division === divName &&
        fi.type !== 'division_health' &&
        (fi.severity === 'critical' || fi.severity === 'warning')
      ).length;

      const row = el('div', { class: 'division-row' },
        el('div', { class: 'division-col division-col-name' },
          el('span', { class: 'division-dot', style: { backgroundColor: deptColor } }),
          divName
        ),
        el('div', { class: 'division-col division-col-bar' },
          el('div', { class: 'division-bar' },
            el('div', {
              class: 'division-bar-fill',
              style: {
                width: score + '%',
                background: 'linear-gradient(90deg, ' + deptColor + ', ' + deptColor + 'aa)'
              }
            }),
            el('span', { class: 'division-bar-label' }, score + '')
          )
        ),
        el('div', { class: 'division-col division-col-stat filled' }, String(filled)),
        el('div', { class: 'division-col division-col-stat vacant' }, String(vacant)),
        el('div', { class: 'division-col division-col-stat interim' }, String(interim)),
        el('div', { class: 'division-col division-col-stat issues' }, String(divIssues))
      );

      section.appendChild(row);
    });

    return section;
  }

  function renderFindings(findings) {
    const section = el('div', { class: 'findings-section' });

    section.appendChild(
      el('h3', { class: 'analysis-section-title' },
        el('span', { class: 'analysis-section-icon', innerHTML: Icons.target(16) }),
        'Detailed Findings (' + findings.length + ')'
      )
    );

    // Group by severity
    const groups = [
      { key: 'critical', label: 'Critical Issues', findings: findings.filter(f => f.severity === 'critical') },
      { key: 'warning', label: 'Warnings', findings: findings.filter(f => f.severity === 'warning') },
      { key: 'info', label: 'Informational', findings: findings.filter(f => f.severity === 'info') }
    ];

    groups.forEach(group => {
      if (group.findings.length === 0) return;

      const groupEl = el('div', { class: 'findings-group severity-' + group.key });

      groupEl.appendChild(
        el('div', { class: 'findings-group-header' },
          el('span', {
            class: 'findings-group-dot',
            style: { backgroundColor: severityColor(group.key) }
          }),
          el('span', { class: 'findings-group-label' }, group.label),
          el('span', { class: 'findings-group-count' }, String(group.findings.length))
        )
      );

      group.findings.forEach(f => {
        groupEl.appendChild(renderFindingCard(f));
      });

      section.appendChild(groupEl);
    });

    return section;
  }

  function renderFindingCard(finding) {
    const card = el('div', { class: 'finding-card' });

    // Severity bar
    card.appendChild(
      el('div', {
        class: 'finding-severity-bar severity-' + finding.severity,
        style: { backgroundColor: severityColor(finding.severity) }
      })
    );

    const content = el('div', { class: 'finding-content' });

    // Header
    const header = el('div', { class: 'finding-header' },
      el('span', { class: 'finding-icon', innerHTML: severityIcon(finding.severity) }),
      el('span', { class: 'finding-title' }, finding.title)
    );
    if (finding.metric !== null && finding.metric !== undefined) {
      header.appendChild(
        el('span', { class: 'finding-metric' }, String(finding.metric))
      );
    }
    content.appendChild(header);

    // Body
    content.appendChild(
      el('div', { class: 'finding-body' }, finding.description)
    );

    // Chips for affected nodes
    if (finding.affectedNodes && finding.affectedNodes.length > 0) {
      const chips = el('div', { class: 'finding-chips' });

      finding.affectedNodes.forEach(nodeId => {
        const node = Store.findNode(nodeId);
        if (!node) return;

        const deptColor = Store.getDeptColor(node.department);
        const chip = el('button', { class: 'finding-chip', dataset: { id: nodeId } },
          el('span', { class: 'finding-chip-dot', style: { backgroundColor: deptColor } }),
          node.title
        );

        chip.addEventListener('click', () => {
          Store.select(nodeId);
          Store.expandToNode(nodeId);
          Events.emit('view:switchTo', 'chart');

          // Slight defer to let view switch settle
          requestAnimationFrame(() => {
            if (OC.TreeView && OC.TreeView.refresh) OC.TreeView.refresh();
            if (OC.ChartView && OC.ChartView.refresh) OC.ChartView.refresh();
            if (OC.PositionCard && OC.PositionCard.refresh) OC.PositionCard.refresh();
          });
        });

        chips.appendChild(chip);
      });

      content.appendChild(chips);
    }

    card.appendChild(content);
    return card;
  }

  /* ── Public API ─────────────────────────── */

  return {
    init() {
      Events.on('store:viewChanged', (view) => {
        if (view === 'analysis') render();
      });
      Events.on('store:dataChanged', () => {
        if (OC.Store.getState().view === 'analysis') render();
      });
    },
    render,
    refresh: render,
    runAnalysis
  };
})();
