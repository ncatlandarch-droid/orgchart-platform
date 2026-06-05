/* ============================================
 * ORGCHART PLATFORM — Header Module
 * ============================================ */

OC.Header = (function() {
  const { Utils, Icons, Store, Events, I18n } = OC;
  const { el } = Utils;

  function render() {
    const header = Utils.$('.app-header');
    if (!header) return;

    const cfg = CONFIG.organization;
    header.innerHTML = '';

    // Brand — use real NC A&T logo if available
    const logoEl = el('div', { class: 'header-logo' });
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/ncat-logo-white.png';
    logoImg.alt = cfg.shortName + ' Logo';
    logoImg.onerror = function() {
      // Fallback to text if image missing
      this.parentElement.innerHTML = cfg.shortName ? cfg.shortName.replace(/[^A-Z&]/g, '').slice(0, 3) : 'OC';
      this.parentElement.style.fontWeight = '900';
      this.parentElement.style.fontSize = '14px';
      this.parentElement.style.color = '#003366';
    };
    logoEl.appendChild(logoImg);

    const brand = el('div', { class: 'header-brand' },
      logoEl,
      el('div', { class: 'header-titles' },
        el('div', { class: 'header-org-name' }, cfg.name),
        el('div', { class: 'header-tagline' }, cfg.tagline)
      )
    );

    // Search
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

    // Controls
    const controls = el('div', { class: 'header-controls' });

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
    controls.appendChild(viewToggle);

    // Admin toggle
    if (CONFIG.features.adminEditing) {
      const adminBtn = el('button', {
        class: 'header-btn',
        id: 'admin-toggle-btn',
        innerHTML: Icons.edit(14) + ' <span>' + I18n.t('adminMode') + '</span>'
      });
      adminBtn.addEventListener('click', () => {
        const newState = !Store.getState().adminMode;
        Store.setAdminMode(newState);
        adminBtn.classList.toggle('active', newState);
      });
      controls.appendChild(adminBtn);
    }

    // Export
    if (CONFIG.features.importExport) {
      const exportBtn = el('button', {
        class: 'header-btn',
        id: 'export-btn',
        innerHTML: Icons.download(14) + ' <span>Export</span>'
      });
      exportBtn.addEventListener('click', () => Events.emit('export:open'));
      controls.appendChild(exportBtn);

      const importBtn = el('button', {
        class: 'header-btn',
        id: 'import-btn',
        innerHTML: Icons.upload(14) + ' <span>Import</span>'
      });
      importBtn.addEventListener('click', () => Events.emit('import:open'));
      controls.appendChild(importBtn);
    }

    header.appendChild(brand);
    header.appendChild(searchWrap);
    header.appendChild(controls);
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

  return {
    init() {
      render();
      renderStats();
      Events.on('store:statsChanged', renderStats);
      Events.on('store:dataChanged', () => { render(); renderStats(); });
      Events.on('view:switchTo', (view) => {
        Store.setView(view);
        updateViewBtns(view);
      });
    }
  };
})();
