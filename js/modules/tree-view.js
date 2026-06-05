/* ============================================
 * ORGCHART PLATFORM — Tree View Module
 * Renders hierarchy filter chips into stats bar
 * (sidebar is now ORI-only)
 * ============================================ */

OC.TreeView = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  let filterContainer;

  /* ── Filter Bar (renders into stats bar) ── */
  function renderFilterBar() {
    if (!CONFIG.features.departmentFilter) return null;

    const bar = el('div', { class: 'hierarchy-filter-bar' });
    const depts = Store.getDepartments();
    const state = Store.getState();
    const activeDepts = state.filters.departments;
    const activeStatuses = state.filters.statuses;
    const hasFilters = Store.hasActiveFilters();

    // "All" chip
    const allChip = el('button', {
      class: 'filter-chip filter-chip-all' + (!hasFilters ? ' active' : '')
    }, 'All');
    allChip.addEventListener('click', () => {
      Store.clearFilters();
      refreshFilters();
      if (OC.ChartView) OC.ChartView.refresh();
    });
    bar.appendChild(allChip);

    // Department chips — sorted by count
    const sorted = Object.entries(depts).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([dept, count]) => {
      const color = Store.getDeptColor(dept);
      const isActive = activeDepts.includes(dept);
      const deptIcon = Store.getDeptIcon(dept);
      const chip = el('button', {
        class: 'filter-chip' + (isActive ? ' active' : ''),
        style: { '--chip-color': color + 'cc' }
      });
      // Icon or dot
      if (deptIcon) {
        const iconImg = document.createElement('img');
        iconImg.src = deptIcon;
        iconImg.alt = dept;
        iconImg.className = 'filter-chip-icon';
        iconImg.style.width = '14px';
        iconImg.style.height = '14px';
        iconImg.style.flexShrink = '0';
        iconImg.onerror = function() {
          this.replaceWith(Object.assign(document.createElement('span'), {
            className: 'filter-chip-dot',
            style: 'background-color:' + color
          }));
        };
        chip.appendChild(iconImg);
      } else {
        chip.appendChild(el('span', { class: 'filter-chip-dot', style: { backgroundColor: color } }));
      }
      chip.appendChild(document.createTextNode(dept));
      chip.appendChild(el('span', { class: 'filter-chip-count' }, String(count)));
      chip.addEventListener('click', () => {
        Store.toggleDepartmentFilter(dept);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      bar.appendChild(chip);
    });

    // Status filter group
    const statusGroup = el('div', { class: 'filter-status-group' });
    const statuses = [
      { key: 'vacant', label: 'Vacant', color: 'var(--status-vacant)' },
      { key: 'interim', label: 'Interim', color: 'var(--status-interim)' }
    ];
    statuses.forEach(s => {
      const isActive = activeStatuses.includes(s.key);
      const chip = el('button', {
        class: 'filter-chip' + (isActive ? ' active' : ''),
        style: { '--chip-color': s.color }
      },
        el('span', { class: 'filter-chip-dot', style: { backgroundColor: s.color } }),
        s.label
      );
      chip.addEventListener('click', () => {
        Store.toggleStatusFilter(s.key);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      statusGroup.appendChild(chip);
    });
    bar.appendChild(statusGroup);

    return bar;
  }

  function refreshFilters() {
    if (!filterContainer) return;
    Utils.empty(filterContainer);
    const bar = renderFilterBar();
    if (bar) filterContainer.appendChild(bar);
  }

  function render() {
    // Insert filter chips into the stats bar area
    const statsBar = Utils.$('.stats-bar') || document.getElementById('stats-bar');
    if (!statsBar) return;

    // Create or find the filter container after the stats bar
    filterContainer = Utils.$('.hierarchy-filter-container');
    if (!filterContainer) {
      filterContainer = el('div', { class: 'hierarchy-filter-container', id: 'hierarchy-filters' });
      statsBar.parentNode.insertBefore(filterContainer, statsBar.nextSibling);
    }

    Utils.empty(filterContainer);
    const filterBar = renderFilterBar();
    if (filterBar) filterContainer.appendChild(filterBar);
  }

  return {
    init() {
      render();
      Events.on('store:selected', () => {});
      Events.on('store:expandAll', () => {});
      Events.on('store:collapseAll', () => {});
      Events.on('store:dataChanged', render);
      Events.on('store:filtersChanged', refreshFilters);
    },
    refresh: refreshFilters
  };
})();
