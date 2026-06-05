/* ============================================
 * ORGCHART PLATFORM — Position Card Module
 * ============================================ */

OC.PositionCard = (function() {
  const { Utils, Icons, Store, Events, I18n } = OC;
  const { el } = Utils;

  let panel;

  function render() {
    panel = Utils.$('.detail-panel');
    if (!panel) return;

    const node = Store.getSelected();
    if (!node) {
      renderEmpty();
      return;
    }

    const state = Store.getState();
    const deptColor = Store.getDeptColor(node.department);
    const meta = node.metadata || {};
    const chain = Store.getReportingChain(node.id);

    Utils.empty(panel);

    // Header section
    const headerSection = el('div', { class: 'detail-panel-header anim-fade-in' });

    // Breadcrumb
    const breadcrumb = el('div', { class: 'detail-breadcrumb' });
    chain.forEach((item, i) => {
      const crumbItem = el('span', {
        class: 'detail-breadcrumb-item',
        dataset: { id: item.id }
      }, item.id === node.id ? item.title : truncate(item.title, 20));
      crumbItem.addEventListener('click', () => {
        Store.select(item.id);
        Store.expandToNode(item.id);
        render();
        OC.TreeView.refresh();
        OC.ChartView.refresh();
      });
      breadcrumb.appendChild(crumbItem);
      if (i < chain.length - 1) {
        breadcrumb.appendChild(el('span', { class: 'detail-breadcrumb-sep', innerHTML: Icons.chevronRight(10) }));
      }
    });
    headerSection.appendChild(breadcrumb);

    // Title
    headerSection.appendChild(el('h2', { class: 'detail-title' }, node.title));

    // Department badge
    const deptBadge = el('span', {
      class: 'detail-department',
      style: { background: deptColor + '18', color: deptColor, border: '1px solid ' + deptColor + '30' }
    });
    // College icon (if available)
    const detailDeptIcon = Store.getDeptIcon(node.department);
    if (detailDeptIcon) {
      const deptIconImg = document.createElement('img');
      deptIconImg.src = detailDeptIcon;
      deptIconImg.alt = node.department;
      deptIconImg.className = 'detail-dept-icon';
      deptIconImg.style.width = '18px';
      deptIconImg.style.height = '18px';
      deptIconImg.style.verticalAlign = 'middle';
      deptIconImg.style.marginRight = '4px';
      deptIconImg.onerror = function() { this.remove(); };
      deptBadge.appendChild(deptIconImg);
    } else {
      deptBadge.appendChild(el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: deptColor, display: 'inline-block' } }));
    }
    deptBadge.appendChild(document.createTextNode(node.department || 'Unknown'));
    headerSection.appendChild(deptBadge);

    // Holder section
    const holderSection = el('div', { class: 'detail-holder-section' });
    const avatar = el('div', { class: 'detail-holder-avatar' },
      Utils.getInitials(node.holder ? node.holder.name : '?')
    );
    const holderInfo = el('div', { class: 'detail-holder-info' },
      el('div', { class: 'detail-holder-name' }, node.holder && node.holder.name ? node.holder.name : 'Position Unfilled'),
      el('div', { class: 'detail-holder-since' },
        node.holder && node.holder.since ? 'Since ' + node.holder.since : ''
      )
    );
    const statusBadge = el('span', {
      class: 'detail-status-badge ' + node.status
    }, I18n.t('status' + capitalize(node.status)));

    holderSection.appendChild(avatar);
    holderSection.appendChild(holderInfo);
    holderSection.appendChild(statusBadge);
    headerSection.appendChild(holderSection);

    panel.appendChild(headerSection);

    // Tabs
    const tabs = el('div', { class: 'detail-tabs' });
    const tabNames = [
      { key: 'overview', label: I18n.t('tabOverview') },
      { key: 'qualifications', label: I18n.t('tabQualifications') },
      { key: 'reporting', label: I18n.t('tabReporting') }
    ];

    tabNames.forEach(tab => {
      const tabBtn = el('button', {
        class: 'detail-tab' + (state.detailTab === tab.key ? ' active' : ''),
        dataset: { tab: tab.key }
      }, tab.label);
      tabBtn.addEventListener('click', () => {
        Store.setDetailTab(tab.key);
        render();
      });
      tabs.appendChild(tabBtn);
    });
    panel.appendChild(tabs);

    // Body
    const body = el('div', { class: 'detail-body' });

    if (state.detailTab === 'overview') {
      renderOverview(body, node, meta, deptColor);
    } else if (state.detailTab === 'qualifications') {
      renderQualifications(body, node, meta);
    } else if (state.detailTab === 'reporting') {
      renderReporting(body, node, chain, deptColor);
    }

    panel.appendChild(body);
  }

  function renderOverview(body, node, meta, deptColor) {
    // Necessity
    if (meta.necessity) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.target(14) }), I18n.t('labelNecessity')
        ),
        el('div', { class: 'detail-necessity' }, meta.necessity)
      );
      body.appendChild(section);
    }

    // Competencies
    if (meta.competencies && meta.competencies.length > 0) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.bookOpen(14) }), I18n.t('labelCompetencies')
        )
      );
      const tags = el('div', { class: 'competency-tags' });
      meta.competencies.forEach(c => {
        tags.appendChild(el('span', { class: 'competency-tag' }, c));
      });
      section.appendChild(tags);
      body.appendChild(section);
    }

    // Metadata grid
    const gridItems = [];
    if (meta.directReports) gridItems.push({ label: I18n.t('labelDirectReports'), value: meta.directReports });
    if (meta.teamSize) gridItems.push({ label: 'Team Size', value: meta.teamSize });
    if (meta.salaryBand && CONFIG.features.salaryBands) gridItems.push({ label: I18n.t('labelSalary'), value: meta.salaryBand });
    if (meta.classification) gridItems.push({ label: I18n.t('labelClassification'), value: meta.classification });

    if (gridItems.length > 0) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.briefcase(14) }), 'Position Details'
        )
      );
      const grid = el('div', { class: 'detail-meta-grid' });
      gridItems.forEach(item => {
        grid.appendChild(
          el('div', { class: 'detail-meta-item' },
            el('div', { class: 'detail-meta-label' }, item.label),
            el('div', { class: 'detail-meta-value' }, String(item.value))
          )
        );
      });
      section.appendChild(grid);
      body.appendChild(section);
    }

    // Custom fields
    if (meta.custom && CONFIG.features.customFields) {
      const customEntries = Object.entries(meta.custom).filter(([k, v]) => v);
      if (customEntries.length > 0) {
        const section = el('div', { class: 'detail-section anim-fade-in' },
          el('div', { class: 'detail-section-title' },
            el('span', { innerHTML: Icons.info(14) }), 'Additional Info'
          )
        );
        customEntries.forEach(([key, value]) => {
          const fieldDef = CONFIG.customFields.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : capitalize(key);
          section.appendChild(
            el('div', { class: 'detail-meta-item', style: { marginBottom: '4px' } },
              el('div', { class: 'detail-meta-label' }, label),
              el('div', { class: 'detail-meta-value', style: { fontSize: '13px' } }, String(value))
            )
          );
        });
        body.appendChild(section);
      }
    }

    // Direct reports list
    if (node.children && node.children.length > 0) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.users(14) }), `Direct Reports (${node.children.length})`
        )
      );
      const list = el('div', { class: 'direct-reports-list stagger-children' });
      node.children.forEach(child => {
        const childColor = Store.getDeptColor(child.department);
        const item = el('div', { class: 'direct-report-item', dataset: { id: child.id } },
          el('span', { class: 'direct-report-dot', style: { backgroundColor: childColor } }),
          el('span', { class: 'direct-report-title' }, child.title),
          el('span', { class: 'direct-report-holder' }, child.holder && child.holder.name ? child.holder.name : '')
        );
        item.addEventListener('click', () => {
          Store.select(child.id);
          Store.expandToNode(child.id);
          render();
          OC.TreeView.refresh();
          OC.ChartView.refresh();
        });
        list.appendChild(item);
      });
      section.appendChild(list);
      body.appendChild(section);
    }
  }

  function renderQualifications(body, node, meta) {
    // Qualifications
    if (meta.qualifications && meta.qualifications.length > 0) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.gradCap(14) }), I18n.t('labelQualifications')
        )
      );
      const list = el('ul', { class: 'qualification-list' });
      meta.qualifications.forEach(q => {
        list.appendChild(
          el('li', { class: 'qualification-item' },
            el('span', { class: 'qualification-bullet' }),
            el('span', null, q)
          )
        );
      });
      section.appendChild(list);
      body.appendChild(section);
    }

    // Competencies (repeated for this tab)
    if (meta.competencies && meta.competencies.length > 0) {
      const section = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.award(14) }), I18n.t('labelCompetencies')
        )
      );
      const tags = el('div', { class: 'competency-tags' });
      meta.competencies.forEach(c => {
        tags.appendChild(el('span', { class: 'competency-tag' }, c));
      });
      section.appendChild(tags);
      body.appendChild(section);
    }
  }

  function renderReporting(body, node, chain, deptColor) {
    // Reporting chain
    const section = el('div', { class: 'detail-section anim-fade-in' },
      el('div', { class: 'detail-section-title' },
        el('span', { innerHTML: Icons.arrowUp(14) }), I18n.t('tabReporting')
      )
    );

    const chainEl = el('div', { class: 'reporting-chain' });

    chain.forEach((item, i) => {
      const itemColor = Store.getDeptColor(item.department);
      const isCurrent = item.id === node.id;

      const row = el('div', {
        class: 'reporting-chain-item' + (isCurrent ? ' current' : ''),
        dataset: { id: item.id }
      },
        el('div', {
          class: 'reporting-chain-avatar',
          style: { background: itemColor + '20', color: itemColor }
        }, Utils.getInitials(item.holder ? item.holder.name : item.title)),
        el('div', { class: 'reporting-chain-info' },
          el('div', { class: 'reporting-chain-title' }, item.title),
          el('div', { class: 'reporting-chain-holder' },
            item.holder && item.holder.name ? item.holder.name : '')
        )
      );

      if (!isCurrent) {
        row.addEventListener('click', () => {
          Store.select(item.id);
          render();
          OC.TreeView.refresh();
          OC.ChartView.refresh();
        });
        row.style.cursor = 'pointer';
      }

      chainEl.appendChild(row);

      // Connector line between items
      if (i < chain.length - 1) {
        chainEl.appendChild(
          el('div', { class: 'reporting-chain-connector' },
            el('div', { class: 'reporting-chain-line' })
          )
        );
      }
    });

    section.appendChild(chainEl);
    body.appendChild(section);

    // Direct reports
    if (node.children && node.children.length > 0) {
      const reportsSection = el('div', { class: 'detail-section anim-fade-in' },
        el('div', { class: 'detail-section-title' },
          el('span', { innerHTML: Icons.users(14) }), `Reports To This Position (${node.children.length})`
        )
      );
      const list = el('div', { class: 'direct-reports-list' });
      node.children.forEach(child => {
        const childColor = Store.getDeptColor(child.department);
        const item = el('div', { class: 'direct-report-item', dataset: { id: child.id } },
          el('span', { class: 'direct-report-dot', style: { backgroundColor: childColor } }),
          el('span', { class: 'direct-report-title' }, child.title),
          el('span', { class: 'direct-report-holder' },
            child.holder && child.holder.name ? child.holder.name : '')
        );
        item.addEventListener('click', () => {
          Store.select(child.id);
          Store.expandToNode(child.id);
          render();
          OC.TreeView.refresh();
          OC.ChartView.refresh();
        });
        list.appendChild(item);
      });
      reportsSection.appendChild(list);
      body.appendChild(reportsSection);
    }
  }

  function renderEmpty() {
    Utils.empty(panel);
    panel.appendChild(
      el('div', { class: 'detail-empty' },
        el('div', { class: 'detail-empty-icon', innerHTML: Icons.user(28) }),
        el('div', { class: 'detail-empty-title' }, I18n.t('noSelection')),
        el('div', { class: 'detail-empty-text' }, 'Click on any position in the tree or chart to view detailed information about the role.')
      )
    );
  }

  /* ── Helpers ────────────────────────────── */
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function truncate(str, maxLen) {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen) + '…';
  }

  return {
    init() {
      render();
      Events.on('store:selected', render);
      Events.on('store:detailTabChanged', render);
      Events.on('store:dataChanged', render);
      Events.on('store:nodeUpdated', render);
    },
    refresh: render
  };
})();
