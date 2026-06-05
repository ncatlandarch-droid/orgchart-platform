/* ============================================
 * ORGCHART PLATFORM — Chart View Module
 * ============================================
 * Interactive SVG org chart with pan/zoom,
 * curved connector lines, and animated nodes.
 * ============================================ */

OC.ChartView = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  let container, canvas, svgLayer;
  let zoom = 0.7;
  let panX = 0, panY = 0;
  let isDragging = false;
  let dragStartX, dragStartY;
  let nodePositions = {};
  const NODE_W = CONFIG.layout.chartNodeWidth;
  const NODE_H = CONFIG.layout.chartNodeHeight;
  const LEVEL_GAP = CONFIG.layout.chartLevelGap;
  const SIB_GAP = CONFIG.layout.chartSiblingGap;
  const PAD = CONFIG.layout.chartPadding;

  /* ── Tree Layout Algorithm ─────────────── */
  function layoutTree(node, depth) {
    if (!node) return 0;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = Store.isExpanded(node.id);

    if (!hasChildren || !isExpanded) {
      nodePositions[node.id] = { x: 0, y: depth * (NODE_H + LEVEL_GAP), w: NODE_W };
      return NODE_W;
    }

    let totalWidth = 0;
    const childWidths = [];

    node.children.forEach((child, i) => {
      const childW = layoutTree(child, depth + 1);
      childWidths.push(childW);
      totalWidth += childW;
      if (i < node.children.length - 1) totalWidth += SIB_GAP;
    });

    const subtreeWidth = Math.max(totalWidth, NODE_W);

    // Position children
    let offsetX = 0;
    node.children.forEach((child, i) => {
      shiftSubtree(child, offsetX);
      offsetX += childWidths[i] + SIB_GAP;
    });

    // Center parent above children
    const firstChild = nodePositions[node.children[0].id];
    const lastChild = nodePositions[node.children[node.children.length - 1].id];
    const centerX = (firstChild.x + lastChild.x + NODE_W) / 2 - NODE_W / 2;

    nodePositions[node.id] = { x: centerX, y: depth * (NODE_H + LEVEL_GAP), w: subtreeWidth };
    return subtreeWidth;
  }

  function shiftSubtree(node, dx) {
    if (!nodePositions[node.id]) return;
    nodePositions[node.id].x += dx;
    const isExpanded = Store.isExpanded(node.id);
    if (node.children && isExpanded) {
      node.children.forEach(child => shiftSubtree(child, dx));
    }
  }

  /* ── Render Chart ──────────────────────── */
  function renderChart() {
    container = Utils.$('.chart-container');
    if (!container) return;

    // Clear
    if (canvas) canvas.remove();
    if (svgLayer) svgLayer.remove();

    const data = Store.getData();
    if (!data) return;

    // Calculate layout
    nodePositions = {};
    const totalWidth = layoutTree(data, 0);

    // Create canvas
    canvas = el('div', { class: 'chart-canvas' });
    
    // Create SVG for connectors
    const svgNS = 'http://www.w3.org/2000/svg';
    svgLayer = document.createElementNS(svgNS, 'svg');
    svgLayer.setAttribute('class', 'chart-connectors');
    svgLayer.style.position = 'absolute';
    svgLayer.style.top = '0';
    svgLayer.style.left = '0';
    svgLayer.style.width = (totalWidth + PAD * 2) + 'px';
    svgLayer.style.height = getMaxDepth(data) * (NODE_H + LEVEL_GAP) + NODE_H + PAD * 2 + 'px';
    svgLayer.style.pointerEvents = 'none';

    canvas.style.width = svgLayer.style.width;
    canvas.style.height = svgLayer.style.height;

    // Render nodes and connectors
    renderNodesRecursive(data, canvas, svgLayer);

    canvas.appendChild(svgLayer);
    container.appendChild(canvas);

    // Center initial view
    centerChart(totalWidth, getMaxDepth(data));
    applyTransform();
  }

  function getMaxDepth(node, depth = 0) {
    if (!node.children || !Store.isExpanded(node.id)) return depth;
    let max = depth;
    node.children.forEach(c => {
      max = Math.max(max, getMaxDepth(c, depth + 1));
    });
    return max;
  }

  function renderNodesRecursive(node, parentEl, svgEl) {
    const pos = nodePositions[node.id];
    if (!pos) return;

    const deptColor = Store.getDeptColor(node.department);
    const isSelected = Store.getState().selectedId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = Store.isExpanded(node.id);

    // Create node element
    const isDimmed = Store.hasActiveFilters() && !Store.nodeMatchesFilters(node);
    const nodeEl = el('div', {
      class: 'chart-node' + (isSelected ? ' selected' : '') + (isDimmed ? ' dimmed' : ''),
      dataset: { id: node.id },
      style: {
        left: (pos.x + PAD) + 'px',
        top: (pos.y + PAD) + 'px',
        width: NODE_W + 'px'
      }
    });

    // Department color bar
    nodeEl.appendChild(el('div', {
      class: 'chart-node-dept-bar',
      style: { background: `linear-gradient(90deg, ${deptColor}, ${deptColor}88)` }
    }));

    // Title
    nodeEl.appendChild(el('div', { class: 'chart-node-title' }, node.title));

    // Holder with status
    const holderRow = el('div', { class: 'chart-node-holder' });
    holderRow.appendChild(el('span', {
      class: 'chart-node-status ' + node.status
    }));
    holderRow.appendChild(document.createTextNode(
      node.holder && node.holder.name ? node.holder.name : 'TBD'
    ));
    nodeEl.appendChild(holderRow);

    // Expand/collapse button
    if (hasChildren) {
      const expandBtn = el('div', {
        class: 'chart-node-expand',
        innerHTML: isExpanded ? Icons.minus(10) : Icons.plus(10),
        title: isExpanded ? 'Collapse' : 'Expand (' + node.children.length + ')'
      });
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Store.toggleExpand(node.id);
        renderChart();
        OC.TreeView.refresh();
      });
      nodeEl.appendChild(expandBtn);
    }

    // Click to select
    nodeEl.addEventListener('click', () => {
      Store.select(node.id);
      renderChart();
      OC.TreeView.refresh();
    });

    parentEl.appendChild(nodeEl);

    // Draw connector lines to children
    if (hasChildren && isExpanded) {
      node.children.forEach(child => {
        const childPos = nodePositions[child.id];
        if (!childPos) return;

        const x1 = pos.x + PAD + NODE_W / 2;
        const y1 = pos.y + PAD + NODE_H;
        const x2 = childPos.x + PAD + NODE_W / 2;
        const y2 = childPos.y + PAD;
        const midY = y1 + (y2 - y1) * 0.5;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`);
        path.setAttribute('class', 'chart-connector-line');
        path.style.stroke = deptColor;
        svgEl.appendChild(path);

        renderNodesRecursive(child, parentEl, svgEl);
      });
    }
  }

  function centerChart(totalWidth, maxDepth) {
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const chartW = totalWidth + PAD * 2;
    const chartH = maxDepth * (NODE_H + LEVEL_GAP) + NODE_H + PAD * 2;

    // Fit zoom
    const zoomW = cw / chartW;
    const zoomH = ch / chartH;
    zoom = Math.min(zoomW, zoomH, 1) * 0.85;

    panX = (cw - chartW * zoom) / 2;
    panY = PAD;
  }

  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  }

  /* ── Pan & Zoom ────────────────────────── */
  function setupInteractions() {
    container = Utils.$('.chart-container');
    if (!container) return;

    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.chart-node') || e.target.closest('.chart-node-expand')) return;
      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      applyTransform();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (container) container.style.cursor = 'grab';
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(0.2, Math.min(2, zoom + delta));

      // Zoom toward cursor
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      panX = mx - (mx - panX) * (newZoom / zoom);
      panY = my - (my - panY) * (newZoom / zoom);
      zoom = newZoom;

      applyTransform();
      updateZoomDisplay();
    }, { passive: false });
  }

  function updateZoomDisplay() {
    const zoomLevel = Utils.$('.chart-zoom-level');
    if (zoomLevel) zoomLevel.textContent = Math.round(zoom * 100) + '%';
  }

  function renderZoomControls() {
    const existing = Utils.$('.chart-zoom-controls');
    if (existing) existing.remove();

    const panel = Utils.$('.center-panel');
    if (!panel) return;

    const controls = el('div', { class: 'chart-zoom-controls' },
      el('button', { class: 'chart-zoom-btn', innerHTML: Icons.plus(16), title: 'Zoom In' }),
      el('div', { class: 'chart-zoom-level' }, Math.round(zoom * 100) + '%'),
      el('button', { class: 'chart-zoom-btn', innerHTML: Icons.minus(16), title: 'Zoom Out' }),
      el('button', { class: 'chart-zoom-btn', innerHTML: Icons.maximize(16), title: 'Fit to Screen' })
    );

    const [zoomIn, , zoomOut, fit] = controls.children;

    zoomIn.addEventListener('click', () => {
      zoom = Math.min(2, zoom + 0.1);
      applyTransform();
      updateZoomDisplay();
    });

    zoomOut.addEventListener('click', () => {
      zoom = Math.max(0.2, zoom - 0.1);
      applyTransform();
      updateZoomDisplay();
    });

    fit.addEventListener('click', () => {
      const data = Store.getData();
      if (data) {
        const totalWidth = nodePositions[data.id] ? nodePositions[data.id].w || 1000 : 1000;
        centerChart(totalWidth, getMaxDepth(data));
        applyTransform();
        updateZoomDisplay();
      }
    });

    panel.appendChild(controls);
  }

  return {
    init() {
      setupInteractions();
      renderChart();
      renderZoomControls();

      Events.on('store:selected', renderChart);
      Events.on('store:expandAll', renderChart);
      Events.on('store:collapseAll', renderChart);
      Events.on('store:dataChanged', renderChart);
      Events.on('store:filtersChanged', renderChart);

      // Handle analysis view toggle
      Events.on('store:viewChanged', (view) => {
        const chartContainer = Utils.$('.chart-container');
        if (!chartContainer) return;
        if (view === 'analysis') {
          chartContainer.style.display = 'none';
        } else {
          chartContainer.style.display = '';
          renderChart();
        }
      });
    },
    refresh: renderChart
  };
})();
