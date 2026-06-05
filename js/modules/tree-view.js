/* ============================================
 * ORGCHART PLATFORM — Tree View Module
 * ============================================ */

OC.TreeView = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  let container;

  /* ── Filter Bar ─────────────────────────── */
  function renderFilterBar() {
    if (!CONFIG.features.departmentFilter) return null;

    const bar = el('div', { class: 'filter-bar' });
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
      renderTree();
      renderFilterBar_update();
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
        renderTree();
        renderFilterBar_update();
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
        renderTree();
        renderFilterBar_update();
        if (OC.ChartView) OC.ChartView.refresh();
      });
      statusGroup.appendChild(chip);
    });
    bar.appendChild(statusGroup);

    return bar;
  }

  function renderFilterBar_update() {
    const oldBar = Utils.$('.filter-bar', container);
    if (!oldBar) return;
    const newBar = renderFilterBar();
    if (newBar) {
      container.replaceChild(newBar, oldBar);
    }
  }

  /* ── Tree Node ──────────────────────────── */
  function renderNode(node) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = Store.isExpanded(node.id);
    const isSelected = Store.getState().selectedId === node.id;
    const deptColor = Store.getDeptColor(node.department);
    const indent = (node._depth || 0) * CONFIG.layout.treeIndent;
    const matchesFilter = Store.nodeOrDescendantMatches(node);
    const directMatch = Store.nodeMatchesFilters(node);

    // Node row
    const row = el('div', {
      class: 'tree-node-row' + (isSelected ? ' selected' : '') + (!matchesFilter && Store.hasActiveFilters() ? ' dimmed' : ''),
      dataset: { id: node.id },
      style: { paddingLeft: (indent + 12) + 'px' }
    });

    // Expand button
    if (hasChildren) {
      const childCount = node.children.length;
      const expandBtn = el('button', {
        class: 'tree-expand-btn' + (isExpanded ? ' expanded' : ''),
        innerHTML: Icons.chevronRight(12),
        title: childCount + ' reports'
      });
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Store.toggleExpand(node.id);
        renderTree();
      });
      row.appendChild(expandBtn);
    } else {
      row.appendChild(el('span', { class: 'tree-expand-btn', style: { visibility: 'hidden' } }));
    }

    // Department icon or dot
    const deptIcon = Store.getDeptIcon(node.department);
    if (deptIcon) {
      const iconImg = document.createElement('img');
      iconImg.src = deptIcon;
      iconImg.alt = node.department;
      iconImg.className = 'tree-dept-icon';
      iconImg.style.width = '16px';
      iconImg.style.height = '16px';
      iconImg.style.flexShrink = '0';
      iconImg.onerror = function() {
        // Fallback to dot if icon fails
        this.replaceWith(Object.assign(document.createElement('span'), {
          className: 'tree-dept-dot',
          style: 'background-color:' + deptColor
        }));
      };
      row.appendChild(iconImg);
    } else {
      const dot = el('span', {
        class: 'tree-dept-dot',
        style: { backgroundColor: deptColor, '--dot-color': deptColor }
      });
      row.appendChild(dot);
    }

    // Label
    const label = el('span', { class: 'tree-node-label' }, node.title);
    row.appendChild(label);

    // Child count badge (when collapsed)
    if (hasChildren && !isExpanded) {
      const badge = el('span', {
        class: 'tree-status-badge',
        style: { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '9px' }
      }, String(node.children.length));
      row.appendChild(badge);
    }

    // Status badge
    if (node.status === 'vacant') {
      row.appendChild(el('span', { class: 'tree-status-badge vacant' }, 'Vacant'));
    } else if (node.status === 'interim') {
      row.appendChild(el('span', { class: 'tree-status-badge interim' }, 'Interim'));
    }

    // Click to select
    row.addEventListener('click', () => {
      Store.select(node.id);
      renderTree();
    });

    // Build node container
    const nodeEl = el('div', { class: 'tree-node' }, row);

    // Children
    if (hasChildren) {
      const childrenEl = el('div', {
        class: 'tree-children' + (isExpanded ? '' : ' collapsed')
      });
      if (isExpanded) {
        node.children.forEach(child => {
          childrenEl.appendChild(renderNode(child));
        });
      }
      nodeEl.appendChild(childrenEl);
    }

    return nodeEl;
  }

  function renderTree() {
    if (!container) return;
    const treeArea = Utils.$('.sidebar-tree', container);
    if (!treeArea) return;

    Utils.empty(treeArea);
    const data = Store.getData();
    if (data) {
      treeArea.appendChild(renderNode(data));
    }
  }

  function render() {
    container = Utils.$('.sidebar');
    if (!container) return;

    container.innerHTML = '';

    // Header
    const header = el('div', { class: 'sidebar-header' },
      el('span', { class: 'sidebar-title' },
        el('span', { class: 'sidebar-title-icon', innerHTML: Icons.network(14) }),
        'Hierarchy'
      ),
      el('button', { class: 'sidebar-toggle', innerHTML: Icons.panelLeft(14) })
    );

    const toggle = Utils.$('.sidebar-toggle', header);
    toggle.addEventListener('click', () => {
      container.classList.toggle('collapsed');
    });

    container.appendChild(header);

    // Filter bar
    const filterBar = renderFilterBar();
    if (filterBar) container.appendChild(filterBar);

    container.appendChild(el('div', { class: 'sidebar-tree' }));

    renderTree();
  }

  return {
    init() {
      render();
      Events.on('store:selected', renderTree);
      Events.on('store:expandAll', renderTree);
      Events.on('store:collapseAll', renderTree);
      Events.on('store:dataChanged', render);
      Events.on('store:filtersChanged', () => { renderTree(); renderFilterBar_update(); });
    },
    refresh: renderTree
  };
})();
