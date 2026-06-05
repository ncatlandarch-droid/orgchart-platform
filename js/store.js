/* ============================================
 * ORGCHART PLATFORM — State Store
 * ============================================
 * Central data store managing organizational
 * hierarchy, selection state, and derived data.
 * ============================================ */

OC.Store = (function() {
  const { Utils, Events } = OC;

  /* ── State ──────────────────────────────── */
  let state = {
    data: null,               // Root node of org tree
    flatNodes: [],            // Flat array of all nodes
    nodeMap: {},              // id → node lookup
    parentMap: {},            // id → parent node
    selectedId: null,
    expandedIds: new Set(),
    currentView: 'chart',    // 'chart' | 'analysis'
    searchQuery: '',
    searchResults: [],
    adminMode: false,
    detailTab: 'overview',   // 'overview' | 'qualifications' | 'reporting'
    stats: { total: 0, filled: 0, vacant: 0, interim: 0, departments: 0 },
    filters: {
      departments: [],        // Active department filters (empty = show all)
      statuses: []            // Active status filters (empty = show all)
    }
  };

  /* ── Data Processing ────────────────────── */
  function processData(root) {
    const flat = [];
    const map = {};
    const parentMap = {};
    const deptSet = new Set();

    function walk(node, parent, depth) {
      node._depth = depth;
      flat.push(node);
      map[node.id] = node;
      if (parent) parentMap[node.id] = parent;
      if (node.department) deptSet.add(node.department);
      if (node.children) {
        node.children.forEach(c => walk(c, node, depth + 1));
      }
    }
    walk(root, null, 0);

    // Compute stats
    const stats = {
      total: flat.length,
      filled: flat.filter(n => n.status === 'filled').length,
      vacant: flat.filter(n => n.status === 'vacant').length,
      interim: flat.filter(n => n.status === 'interim').length,
      departments: deptSet.size
    };

    // Default expand top 2 levels
    const expandedIds = new Set();
    flat.forEach(n => {
      if (n._depth < 2 && n.children && n.children.length > 0) {
        expandedIds.add(n.id);
      }
    });

    return { flat, map, parentMap, stats, expandedIds, deptSet };
  }

  /* ── Filter helpers ─────────────────────── */
  function nodeMatchesFilters(node) {
    const { departments, statuses } = state.filters;
    if (departments.length > 0 && !departments.includes(node.department)) return false;
    if (statuses.length > 0 && !statuses.includes(node.status)) return false;
    return true;
  }

  function nodeOrDescendantMatches(node) {
    if (nodeMatchesFilters(node)) return true;
    if (node.children) {
      return node.children.some(c => nodeOrDescendantMatches(c));
    }
    return false;
  }

  /* ── Public API ─────────────────────────── */
  return {
    init(orgData) {
      const { flat, map, parentMap, stats, expandedIds } = processData(orgData);
      state.data = orgData;
      state.flatNodes = flat;
      state.nodeMap = map;
      state.parentMap = parentMap;
      state.stats = stats;
      state.expandedIds = expandedIds;
      state.selectedId = orgData.id;
      Events.emit('store:initialized', state);
    },

    getState() { return state; },
    getData()  { return state.data; },
    getNode(id) { return state.nodeMap[id]; },
    findNode(id) { return state.nodeMap[id]; },
    getParent(id) { return state.parentMap[id]; },
    getFlat() { return state.flatNodes; },
    flattenTree() { return state.flatNodes; },
    getStats() { return state.stats; },
    getSelected() { return state.nodeMap[state.selectedId]; },

    getDepartments() {
      const depts = {};
      state.flatNodes.forEach(n => {
        if (n.department) {
          if (!depts[n.department]) depts[n.department] = 0;
          depts[n.department]++;
        }
      });
      return depts;
    },

    nodeMatchesFilters,
    nodeOrDescendantMatches,

    getReportingChain(id) {
      const chain = [];
      let current = state.nodeMap[id];
      while (current) {
        chain.unshift(current);
        current = state.parentMap[current.id];
      }
      return chain;
    },

    getDeptColor(dept) {
      return CONFIG.departmentColors[dept] || CONFIG.departmentColors['default'] || '#64748b';
    },

    getDeptIcon(dept) {
      return CONFIG.departmentIcons ? CONFIG.departmentIcons[dept] || null : null;
    },

    /* ── Actions ──────────────────────────── */
    select(id) {
      if (state.selectedId === id) return;
      state.selectedId = id;
      state.detailTab = 'overview';
      Events.emit('store:selected', state.nodeMap[id]);
    },

    toggleExpand(id) {
      if (state.expandedIds.has(id)) {
        state.expandedIds.delete(id);
      } else {
        state.expandedIds.add(id);
      }
      Events.emit('store:expanded', { id, expanded: state.expandedIds.has(id) });
    },

    isExpanded(id) {
      return state.expandedIds.has(id);
    },

    expandAll() {
      state.flatNodes.forEach(n => {
        if (n.children && n.children.length > 0) {
          state.expandedIds.add(n.id);
        }
      });
      Events.emit('store:expandAll');
    },

    collapseAll() {
      state.expandedIds.clear();
      // Keep root expanded
      if (state.data) state.expandedIds.add(state.data.id);
      Events.emit('store:collapseAll');
    },

    expandToNode(id) {
      const chain = this.getReportingChain(id);
      chain.forEach(n => {
        if (n.children && n.children.length > 0) {
          state.expandedIds.add(n.id);
        }
      });
      Events.emit('store:expandAll');
    },

    setView(view) {
      if (state.currentView === view) return;
      state.currentView = view;
      Events.emit('store:viewChanged', view);
    },

    /* ── Filters ──────────────────────────── */
    toggleDepartmentFilter(dept) {
      const idx = state.filters.departments.indexOf(dept);
      if (idx >= 0) {
        state.filters.departments.splice(idx, 1);
      } else {
        state.filters.departments.push(dept);
      }
      Events.emit('store:filtersChanged', state.filters);
    },

    toggleStatusFilter(status) {
      const idx = state.filters.statuses.indexOf(status);
      if (idx >= 0) {
        state.filters.statuses.splice(idx, 1);
      } else {
        state.filters.statuses.push(status);
      }
      Events.emit('store:filtersChanged', state.filters);
    },

    clearFilters() {
      state.filters.departments = [];
      state.filters.statuses = [];
      Events.emit('store:filtersChanged', state.filters);
    },

    hasActiveFilters() {
      return state.filters.departments.length > 0 || state.filters.statuses.length > 0;
    },

    setDetailTab(tab) {
      state.detailTab = tab;
      Events.emit('store:detailTabChanged', tab);
    },

    setAdminMode(on) {
      state.adminMode = on;
      Events.emit('store:adminMode', on);
    },

    search(query) {
      state.searchQuery = query;
      if (!query.trim()) {
        state.searchResults = [];
        Events.emit('store:searchResults', []);
        return;
      }

      const q = query.toLowerCase();
      const results = state.flatNodes.filter(n => {
        return (
          n.title.toLowerCase().includes(q) ||
          (n.holder && n.holder.name && n.holder.name.toLowerCase().includes(q)) ||
          (n.department && n.department.toLowerCase().includes(q)) ||
          (n.division && n.division.toLowerCase().includes(q)) ||
          (n.metadata && n.metadata.competencies && n.metadata.competencies.some(c => c.toLowerCase().includes(q))) ||
          (n.metadata && n.metadata.qualifications && n.metadata.qualifications.some(c => c.toLowerCase().includes(q)))
        );
      });

      state.searchResults = results;
      Events.emit('store:searchResults', results);
    },

    /* ── Admin Operations ─────────────────── */
    updateNode(id, updates) {
      const node = state.nodeMap[id];
      if (!node) return;
      Object.assign(node, updates);
      // Recompute stats
      const { stats } = processData(state.data);
      state.stats = stats;
      Events.emit('store:nodeUpdated', node);
      Events.emit('store:statsChanged', stats);
      this.saveToLocal();
    },

    addChild(parentId, newNode) {
      const parent = state.nodeMap[parentId];
      if (!parent) return;
      if (!parent.children) parent.children = [];
      parent.children.push(newNode);
      // Re-process
      const { flat, map, parentMap, stats } = processData(state.data);
      state.flatNodes = flat;
      state.nodeMap = map;
      state.parentMap = parentMap;
      state.stats = stats;
      state.expandedIds.add(parentId);
      Events.emit('store:dataChanged');
      this.saveToLocal();
    },

    removeNode(id) {
      const parent = state.parentMap[id];
      if (!parent) return; // Can't remove root
      parent.children = parent.children.filter(c => c.id !== id);
      if (state.selectedId === id) state.selectedId = parent.id;
      const { flat, map, parentMap, stats } = processData(state.data);
      state.flatNodes = flat;
      state.nodeMap = map;
      state.parentMap = parentMap;
      state.stats = stats;
      Events.emit('store:dataChanged');
      this.saveToLocal();
    },

    /* ── Persistence ──────────────────────── */
    saveToLocal() {
      try {
        const dataStr = JSON.stringify(state.data);
        localStorage.setItem('orgchart_data', dataStr);
      } catch(e) { console.warn('Could not save to localStorage:', e); }
    },

    loadFromLocal() {
      try {
        const saved = localStorage.getItem('orgchart_data');
        if (saved) return JSON.parse(saved);
      } catch(e) { console.warn('Could not load from localStorage:', e); }
      return null;
    },

    clearLocal() {
      localStorage.removeItem('orgchart_data');
    },

    exportJSON() {
      return JSON.stringify(state.data, null, 2);
    },

    importJSON(jsonStr) {
      try {
        const data = JSON.parse(jsonStr);
        this.init(data);
        Events.emit('store:dataChanged');
        return true;
      } catch(e) {
        console.error('Import failed:', e);
        return false;
      }
    },

    generateId() {
      return 'node-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
    }
  };
})();
