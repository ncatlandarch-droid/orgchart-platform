/* ============================================
 * ORGCHART PLATFORM — Header Module
 * EMMA-style: NC A&T logo | separator | brand
 * ============================================ */

OC.Header = (function() {
  const { Utils, Icons, Store, Events, I18n } = OC;
  const { el } = Utils;

  function render() {
    const header = Utils.$('.app-header');
    if (!header) return;

    const cfg = CONFIG.organization;
    header.innerHTML = '';

    /* ── Top row: logo + brand + search + controls ── */
    const topRow = el('div', { class: 'header-top-row' });

    /* ── Left: Logo + Brand ── */
    const headerLeft = el('div', { class: 'header-left' });

    // NC A&T white logo (same file EMMA uses)
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/ncat-logo-white.png';
    logoImg.alt = 'NC A&T';
    logoImg.className = 'header-at-logo';
    logoImg.onerror = function() {
      this.src = 'assets/ncat-logo.png';
      this.onerror = function() {
        const fallback = el('span', { class: 'header-logo-fallback' }, 'A&T');
        this.replaceWith(fallback);
      };
    };
    headerLeft.appendChild(logoImg);

    // Vertical separator (EMMA pattern)
    headerLeft.appendChild(el('div', { class: 'header-logo-separator' }));

    // Brand text — EMMA-style acronym letters highlighted
    const brandBlock = el('div', { class: 'header-brand-text' });
    const brandName = el('h1', { class: 'header-brand-name' });
    // Highlight the O-R-G letters in accent gold
    brandName.innerHTML =
      '<span class="brand-letter">O</span><span class="brand-word">rganizational </span>' +
      '<span class="brand-letter">R</span><span class="brand-word">esource </span>' +
      '<span class="brand-letter">I</span><span class="brand-word">ntelligence</span>';
    brandBlock.appendChild(brandName);

    // Tagline — EMMA style
    brandBlock.appendChild(
      el('span', { class: 'header-brand-tagline' },
        'POSITION INTELLIGENCE PLATFORM ― NORTH CAROLINA A&T STATE UNIVERSITY')
    );
    headerLeft.appendChild(brandBlock);

    topRow.appendChild(headerLeft);

    /* ── Center: Search ── */
    const searchWrap = el('div', { class: 'header-search' });
    const searchIcon = el('span', { class: 'header-search-icon', innerHTML: Icons.search(16) });
    const searchInput = el('input', {
      class: 'header-search-input',
      type: 'text',
      id: 'header-search-input',
      placeholder: I18n.t('searchPlaceholder')
    });
    searchInput.addEventListener('focus', () => Events.emit('search:open'));
    searchWrap.appendChild(searchIcon);
    searchWrap.appendChild(searchInput);
    topRow.appendChild(searchWrap);

    /* ── Right: Controls ── */
    const headerRight = el('div', { class: 'header-right' });

    // View toggle group
    const viewToggle = el('div', { class: 'view-toggle-group' });
    const currentView = Store.getState().currentView;

    const chartBtn = el('button', {
      class: 'view-toggle-btn' + (currentView === 'chart' ? ' active' : ''),
      id: 'view-chart-btn',
      innerHTML: Icons.network(14) + ' <span>' + I18n.t('chartViewLabel') + '</span>'
    });
    const analysisBtn = el('button', {
      class: 'view-toggle-btn' + (currentView === 'analysis' ? ' active' : ''),
      id: 'view-analysis-btn',
      innerHTML: Icons.target(14) + ' <span>Analysis</span>'
    });

    chartBtn.addEventListener('click', () => {
      Store.setView('chart');
      updateViewBtns('chart');
    });
    analysisBtn.addEventListener('click', () => {
      Store.setView('analysis');
      updateViewBtns('analysis');
    });

    viewToggle.appendChild(chartBtn);
    if (CONFIG.features.analysis) viewToggle.appendChild(analysisBtn);
    headerRight.appendChild(viewToggle);

    // Admin toggle
    if (CONFIG.features.adminEditing) {
      const adminBtn = el('button', {
        class: 'header-control-btn',
        id: 'admin-toggle-btn',
        innerHTML: Icons.edit(14) + ' <span class="control-label">' + I18n.t('adminMode') + '</span>'
      });
      adminBtn.addEventListener('click', () => {
        const newState = !Store.getState().adminMode;
        Store.setAdminMode(newState);
        adminBtn.classList.toggle('active', newState);
      });
      headerRight.appendChild(adminBtn);
    }

    // Export / Import
    if (CONFIG.features.importExport) {
      const exportBtn = el('button', {
        class: 'header-control-btn',
        id: 'export-btn',
        innerHTML: Icons.download(14) + ' <span class="control-label">Export</span>'
      });
      exportBtn.addEventListener('click', () => Events.emit('export:open'));
      headerRight.appendChild(exportBtn);

      const importBtn = el('button', {
        class: 'header-control-btn',
        id: 'import-btn',
        innerHTML: Icons.upload(14) + ' <span class="control-label">Import</span>'
      });
      importBtn.addEventListener('click', () => Events.emit('import:open'));
      headerRight.appendChild(importBtn);
    }

    topRow.appendChild(headerRight);
    header.appendChild(topRow);
  }

  function updateViewBtns(activeView) {
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const id = activeView === 'analysis' ? 'view-analysis-btn' : 'view-chart-btn';
    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');
  }

  function renderStats() {
    const bar = Utils.$('.stats-bar');
    if (!bar) return;

    const stats = Store.getStats();
    bar.innerHTML = '';

    const items = [
      { dot: 'total', value: stats.total, label: I18n.t('statsPositions') },
      { dot: 'filled', value: stats.filled, label: I18n.t('statsFilled') },
      { dot: 'vacant', value: stats.vacant, label: I18n.t('statsVacant') },
      { dot: 'interim', value: stats.interim, label: I18n.t('statsInterim') },
      { dot: 'departments', value: stats.departments, label: I18n.t('statsDepartments') }
    ];

    items.forEach(item => {
      bar.appendChild(
        el('div', { class: 'stat-item' },
          el('span', { class: 'stat-dot ' + item.dot }),
          el('span', { class: 'stat-value' }, String(item.value)),
          el('span', { class: 'stat-label' }, item.label)
        )
      );
    });
  }

  function renderFooter() {
    // Don't double-render
    if (Utils.$('.app-copyright-footer')) return;

    const footer = el('footer', { class: 'app-copyright-footer' });
    footer.innerHTML =
      '<span>© 2026 Think! Design and Planning, LLC. All rights reserved.</span>' +
      '<span>ORI — Organizational Resource Intelligence Platform | Proprietary Software</span>';
    document.body.appendChild(footer);
  }

  return {
    init() {
      render();
      renderStats();
      renderFooter();
      Events.on('store:statsChanged', renderStats);
      Events.on('store:dataChanged', () => { render(); renderStats(); });
      Events.on('view:switchTo', (view) => {
        Store.setView(view);
        updateViewBtns(view);
      });
    }
  };
})();
