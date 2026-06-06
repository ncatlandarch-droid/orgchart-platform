/* ============================================
 * ORGCHART PLATFORM — Tree View Module
 * Renders hierarchy filter dropdowns in stats bar
 * (sidebar is now ORI-only)
 * ============================================ */

OC.TreeView = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  let filterContainer;

  /* ── Close any open dropdown on outside click ── */
  function setupOutsideClick() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
  }

  /* ── Build Department Dropdown ── */
  function buildDeptDropdown() {
    const depts = Store.getDepartments();
    const state = Store.getState();
    const activeDepts = state.filters.departments;
    const hasFilters = Store.hasActiveFilters();
    const sorted = Object.entries(depts).sort((a, b) => b[1] - a[1]);

    // Wrapper
    const dropdown = el('div', { class: 'filter-dropdown' });

    // Toggle button
    const activeCount = activeDepts.length;
    const label = activeCount === 0 ? 'All Departments' : activeCount + ' Selected';
    const toggle = el('button', {
      class: 'filter-dropdown-toggle' + (activeCount > 0 ? ' has-selection' : ''),
      type: 'button'
    },
      el('span', { class: 'filter-dropdown-icon', innerHTML: Icons.network(14) }),
      el('span', { class: 'filter-dropdown-label' }, label),
      el('span', { class: 'filter-dropdown-arrow', innerHTML: '▾' })
    );
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other dropdowns
      document.querySelectorAll('.filter-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
    dropdown.appendChild(toggle);

    // Menu
    const menu = el('div', { class: 'filter-dropdown-menu' });

    // "All" option
    const allItem = el('div', {
      class: 'filter-dropdown-item' + (!hasFilters ? ' active' : '')
    },
      el('span', { class: 'filter-check', innerHTML: !hasFilters ? '✓' : '' }),
      el('span', { class: 'filter-item-label' }, 'All Departments'),
      el('span', { class: 'filter-item-count' }, String(Object.values(depts).reduce((a, b) => a + b, 0)))
    );
    allItem.addEventListener('click', (e) => {
      e.stopPropagation();
      Store.clearFilters();
      refreshFilters();
      if (OC.ChartView) OC.ChartView.refresh();
    });
    menu.appendChild(allItem);

    // Divider
    menu.appendChild(el('div', { class: 'filter-dropdown-divider' }));

    // Department items
    sorted.forEach(([dept, count]) => {
      const color = Store.getDeptColor(dept);
      const isActive = activeDepts.includes(dept);
      const item = el('div', {
        class: 'filter-dropdown-item' + (isActive ? ' active' : '')
      },
        el('span', { class: 'filter-check', innerHTML: isActive ? '✓' : '' }),
        el('span', { class: 'filter-item-dot', style: { backgroundColor: color } }),
        el('span', { class: 'filter-item-label' }, dept),
        el('span', { class: 'filter-item-count' }, String(count))
      );
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        Store.toggleDepartmentFilter(dept);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      menu.appendChild(item);
    });

    dropdown.appendChild(menu);
    return dropdown;
  }

  /* ── Build Status Dropdown ── */
  function buildStatusDropdown() {
    const state = Store.getState();
    const activeStatuses = state.filters.statuses;

    const dropdown = el('div', { class: 'filter-dropdown filter-dropdown-status' });

    const activeCount = activeStatuses.length;
    const label = activeCount === 0 ? 'All Statuses' : activeStatuses.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    const toggle = el('button', {
      class: 'filter-dropdown-toggle' + (activeCount > 0 ? ' has-selection' : ''),
      type: 'button'
    },
      el('span', { class: 'filter-dropdown-icon', innerHTML: Icons.users(14) }),
      el('span', { class: 'filter-dropdown-label' }, label),
      el('span', { class: 'filter-dropdown-arrow', innerHTML: '▾' })
    );
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.filter-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
    dropdown.appendChild(toggle);

    const menu = el('div', { class: 'filter-dropdown-menu' });

    const statuses = [
      { key: 'vacant', label: 'Vacant', color: 'var(--status-vacant)' },
      { key: 'interim', label: 'Interim', color: 'var(--status-interim)' },
      { key: 'filled', label: 'Filled', color: 'var(--status-filled)' }
    ];

    statuses.forEach(s => {
      const isActive = activeStatuses.includes(s.key);
      const item = el('div', {
        class: 'filter-dropdown-item' + (isActive ? ' active' : '')
      },
        el('span', { class: 'filter-check', innerHTML: isActive ? '✓' : '' }),
        el('span', { class: 'filter-item-dot', style: { backgroundColor: s.color } }),
        el('span', { class: 'filter-item-label' }, s.label)
      );
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        Store.toggleStatusFilter(s.key);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      menu.appendChild(item);
    });

    dropdown.appendChild(menu);
    return dropdown;
  }

  /* ── Build Active Filter Tags ── */
  function buildActiveTags() {
    const state = Store.getState();
    const activeDepts = state.filters.departments;
    const activeStatuses = state.filters.statuses;

    if (activeDepts.length === 0 && activeStatuses.length === 0) return null;

    const tags = el('div', { class: 'filter-active-tags' });

    activeDepts.forEach(dept => {
      const color = Store.getDeptColor(dept);
      const tag = el('span', { class: 'filter-tag' },
        el('span', { class: 'filter-tag-dot', style: { backgroundColor: color } }),
        dept,
        el('button', { class: 'filter-tag-remove', innerHTML: '×', title: 'Remove ' + dept })
      );
      tag.querySelector('.filter-tag-remove').addEventListener('click', () => {
        Store.toggleDepartmentFilter(dept);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      tags.appendChild(tag);
    });

    activeStatuses.forEach(s => {
      const colors = { vacant: 'var(--status-vacant)', interim: 'var(--status-interim)', filled: 'var(--status-filled)' };
      const tag = el('span', { class: 'filter-tag' },
        el('span', { class: 'filter-tag-dot', style: { backgroundColor: colors[s] } }),
        s.charAt(0).toUpperCase() + s.slice(1),
        el('button', { class: 'filter-tag-remove', innerHTML: '×', title: 'Remove ' + s })
      );
      tag.querySelector('.filter-tag-remove').addEventListener('click', () => {
        Store.toggleStatusFilter(s);
        refreshFilters();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      tags.appendChild(tag);
    });

    // "Clear All" button
    const clearBtn = el('button', { class: 'filter-tag filter-tag-clear' }, 'Clear All');
    clearBtn.addEventListener('click', () => {
      Store.clearFilters();
      refreshFilters();
      if (OC.ChartView) OC.ChartView.refresh();
    });
    tags.appendChild(clearBtn);

    return tags;
  }

  /* ── Render Full Filter Bar ── */
  function renderFilterBar() {
    if (!CONFIG.features.departmentFilter) return null;

    const bar = el('div', { class: 'hierarchy-filter-bar' });

    // Dropdowns row
    const dropdownRow = el('div', { class: 'filter-dropdowns-row' });
    dropdownRow.appendChild(buildDeptDropdown());
    dropdownRow.appendChild(buildStatusDropdown());

    // Expand / Collapse All buttons
    const expandCollapseGroup = el('div', { class: 'expand-collapse-group' });
    const expandAllBtn = el('button', {
      class: 'expand-collapse-btn',
      id: 'expand-all-btn',
      title: 'Expand All'
    }, '⊞ Expand All');
    expandAllBtn.addEventListener('click', () => {
      Store.expandAll();
      if (OC.ChartView) OC.ChartView.refresh();
    });

    const collapseAllBtn = el('button', {
      class: 'expand-collapse-btn',
      id: 'collapse-all-btn',
      title: 'Collapse All'
    }, '⊟ Collapse All');
    collapseAllBtn.addEventListener('click', () => {
      Store.collapseAll();
      if (OC.ChartView) OC.ChartView.refresh();
    });

    expandCollapseGroup.appendChild(expandAllBtn);
    expandCollapseGroup.appendChild(collapseAllBtn);
    dropdownRow.appendChild(expandCollapseGroup);

    bar.appendChild(dropdownRow);

    // Active tags
    const tags = buildActiveTags();
    if (tags) bar.appendChild(tags);

    return bar;
  }

  function refreshFilters() {
    if (!filterContainer) return;
    Utils.empty(filterContainer);
    const bar = renderFilterBar();
    if (bar) filterContainer.appendChild(bar);
  }

  function render() {
    const statsBar = Utils.$('.stats-bar') || document.getElementById('stats-bar');
    if (!statsBar) return;

    filterContainer = Utils.$('.hierarchy-filter-container');
    if (!filterContainer) {
      filterContainer = el('div', { class: 'hierarchy-filter-container', id: 'hierarchy-filters' });
      statsBar.parentNode.insertBefore(filterContainer, statsBar.nextSibling);
    }

    Utils.empty(filterContainer);
    const filterBar = renderFilterBar();
    if (filterBar) filterContainer.appendChild(filterBar);
  }

  let outsideClickSetup = false;

  return {
    init() {
      render();
      if (!outsideClickSetup) { setupOutsideClick(); outsideClickSetup = true; }
      Events.on('store:selected', () => {});
      Events.on('store:expandAll', () => {});
      Events.on('store:collapseAll', () => {});
      Events.on('store:dataChanged', render);
      Events.on('store:filtersChanged', refreshFilters);
    },
    refresh: refreshFilters
  };
})();
