/* ============================================
 * ORGCHART PLATFORM — Search Module
 * ============================================ */

OC.Search = (function() {
  const { Utils, Icons, Store, Events, I18n } = OC;
  const { el } = Utils;

  let overlay, input, resultsEl;
  let focusedIndex = -1;

  function render() {
    // Create overlay if not exists
    overlay = Utils.$('.search-overlay');
    if (overlay) return;

    overlay = el('div', { class: 'search-overlay', id: 'search-overlay' });

    const modal = el('div', { class: 'search-modal' });

    // Input row
    const inputWrap = el('div', { class: 'search-modal-input-wrap' },
      el('span', { class: 'search-modal-icon', innerHTML: Icons.search(20) })
    );
    input = el('input', {
      class: 'search-modal-input',
      type: 'text',
      id: 'search-modal-input',
      placeholder: I18n.t('searchPlaceholder')
    });
    const closeBtn = el('button', { class: 'search-modal-close' }, 'ESC');

    inputWrap.appendChild(input);
    inputWrap.appendChild(closeBtn);
    modal.appendChild(inputWrap);

    // Results
    resultsEl = el('div', { class: 'search-results', id: 'search-results' });
    modal.appendChild(resultsEl);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Events
    input.addEventListener('input', Utils.debounce(() => {
      Store.search(input.value);
    }, 150));

    input.addEventListener('keydown', handleKeydown);

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        close();
      }
    });
  }

  function handleKeydown(e) {
    const items = Utils.$$('.search-result-item', resultsEl);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
      updateFocus(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIndex = Math.max(focusedIndex - 1, 0);
      updateFocus(items);
    } else if (e.key === 'Enter' && focusedIndex >= 0 && items[focusedIndex]) {
      const id = items[focusedIndex].dataset.id;
      selectResult(id);
    }
  }

  function updateFocus(items) {
    items.forEach((item, i) => {
      item.classList.toggle('focused', i === focusedIndex);
    });
    if (items[focusedIndex]) {
      items[focusedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function renderResults(results) {
    if (!resultsEl) return;
    Utils.empty(resultsEl);
    focusedIndex = -1;

    if (!input || !input.value.trim()) {
      return;
    }

    if (results.length === 0) {
      resultsEl.appendChild(
        el('div', { class: 'search-no-results' }, 'No positions found matching "' + input.value + '"')
      );
      return;
    }

    const query = input.value.toLowerCase();

    results.slice(0, 30).forEach(node => {
      const deptColor = Store.getDeptColor(node.department);
      const item = el('div', {
        class: 'search-result-item',
        dataset: { id: node.id }
      });

      item.appendChild(el('span', {
        class: 'search-result-dot',
        style: { backgroundColor: deptColor }
      }));

      const info = el('div', { class: 'search-result-info' });

      // Highlight matching text in title
      const titleEl = el('div', { class: 'search-result-title' });
      titleEl.innerHTML = highlightMatch(node.title, query);
      info.appendChild(titleEl);

      // Meta info — also highlight matches in holder name & department
      const metaEl = el('div', { class: 'search-result-meta' });
      const metaParts = [];
      if (node.holder && node.holder.name) metaParts.push(highlightMatch(node.holder.name, query));
      if (node.department) metaParts.push(highlightMatch(node.department, query));
      if (node.division) metaParts.push(node.division);
      metaEl.innerHTML = metaParts.join(' · ');
      info.appendChild(metaEl);

      item.appendChild(info);

      // Status
      if (node.status !== 'filled') {
        const statusEl = el('span', {
          class: 'search-result-status',
          style: {
            color: node.status === 'vacant' ? 'var(--status-vacant)' : 'var(--status-interim)'
          }
        }, node.status);
        item.appendChild(statusEl);
      }

      item.addEventListener('click', () => selectResult(node.id));
      resultsEl.appendChild(item);
    });

    if (results.length > 30) {
      resultsEl.appendChild(
        el('div', { class: 'search-no-results' }, `Showing 30 of ${results.length} results`)
      );
    }
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function selectResult(id) {
    // 1. Expand the path first so the node is visible in the chart
    Store.expandToNode(id);
    // 2. Then select — fires store:selected which renders + zooms to node
    Store.select(id);
    close();
    OC.TreeView.refresh();
    // 3. Extra zoom call after render settles (safety net)
    requestAnimationFrame(() => {
      if (OC.ChartView.zoomToNode) {
        OC.ChartView.zoomToNode(id, 0.85, true);
      }
    });
    OC.PositionCard.refresh();
  }

  function open() {
    if (!overlay) return;
    overlay.classList.add('active');
    setTimeout(() => input && input.focus(), 100);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    if (input) input.value = '';
    if (resultsEl) Utils.empty(resultsEl);
    focusedIndex = -1;
  }

  return {
    init() {
      render();
      Events.on('search:open', open);
      Events.on('store:searchResults', renderResults);
    }
  };
})();
