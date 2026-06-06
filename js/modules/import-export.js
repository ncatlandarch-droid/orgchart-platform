/* ============================================
 * ORGCHART PLATFORM — Import / Export Module
 * ============================================ */

OC.ImportExport = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  function init() {
    Events.on('export:open', showExportMenu);
    Events.on('import:open', showImportModal);
  }

  /* ── Export ─────────────────────────────── */
  function showExportMenu() {
    const overlay = el('div', { class: 'modal-overlay active' });
    const content = el('div', { class: 'modal-content' },
      el('div', { class: 'modal-header' },
        el('h3', { class: 'modal-title' }, 'Export Data'),
        el('button', { class: 'modal-close', innerHTML: Icons.x(16) })
      ),
      el('div', { class: 'modal-body' },
        el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
          createExportOption('Export as JSON', 'Full organizational data backup in JSON format. Can be re-imported.', () => { exportJSON(); closeModal(); }),
          createExportOption('Export as CSV', 'Flat spreadsheet format. One row per position.', () => { exportCSV(); closeModal(); }),
          createExportOption('Print View', 'Open a print-friendly version of the org chart.', () => { printView(); closeModal(); })
        )
      )
    );

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    Utils.$('.modal-close', content).addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }

  function createExportOption(title, desc, onClick) {
    const btn = el('div', {
      style: {
        padding: '16px',
        background: 'var(--surface-card)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'all 150ms'
      }
    },
      el('div', { style: { fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' } }, title),
      el('div', { style: { fontSize: '12px', color: 'var(--text-secondary)' } }, desc)
    );

    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'var(--accent)';
      btn.style.background = 'rgba(255, 198, 41, 0.06)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'var(--border-subtle)';
      btn.style.background = 'var(--surface-card)';
    });
    btn.addEventListener('click', onClick);

    return btn;
  }

  function exportJSON() {
    const json = Store.exportJSON();
    downloadFile(json, 'orgchart-data.json', 'application/json');
    OC.Admin.showToast('JSON exported', 'success');
  }

  function exportCSV() {
    const flat = Store.getFlat();
    const headers = ['ID', 'Title', 'Holder', 'Department', 'Division', 'Status', 'Level', 'Salary Band', 'Classification', 'Qualifications', 'Competencies', 'Necessity'];
    const rows = flat.map(n => {
      const m = n.metadata || {};
      return [
        n.id,
        escapeCsv(n.title),
        escapeCsv(n.holder && n.holder.name ? n.holder.name : ''),
        escapeCsv(n.department || ''),
        escapeCsv(n.division || ''),
        n.status || '',
        n.level || '',
        escapeCsv(m.salaryBand || ''),
        escapeCsv(m.classification || ''),
        escapeCsv((m.qualifications || []).join('; ')),
        escapeCsv((m.competencies || []).join('; ')),
        escapeCsv(m.necessity || '')
      ].join(',');
    });

    const csv = headers.join(',') + '\n' + rows.join('\n');
    downloadFile(csv, 'orgchart-data.csv', 'text/csv');
    OC.Admin.showToast('CSV exported', 'success');
  }

  function printView() {
    window.print();
  }

  /* ── Import ────────────────────────────── */
  function showImportModal() {
    const overlay = el('div', { class: 'modal-overlay active' });
    const content = el('div', { class: 'modal-content' },
      el('div', { class: 'modal-header' },
        el('h3', { class: 'modal-title' }, 'Import Data'),
        el('button', { class: 'modal-close', innerHTML: Icons.x(16) })
      )
    );

    const body = el('div', { class: 'modal-body' });

    // Drop zone
    const dropZone = el('div', { class: 'drop-zone', id: 'import-drop-zone' },
      el('div', { class: 'drop-zone-icon', innerHTML: Icons.upload(40) }),
      el('div', { class: 'drop-zone-text' }, 'Drop a JSON file here or click to browse'),
      el('div', { class: 'drop-zone-hint' }, 'Accepts .json files exported from OrgChart Platform')
    );

    const fileInput = el('input', { type: 'file', accept: '.json', style: { display: 'none' } });
    body.appendChild(fileInput);

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFile(e.dataTransfer.files[0], overlay);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleFile(fileInput.files[0], overlay);
    });

    body.appendChild(dropZone);

    // Warning
    body.appendChild(el('div', {
      style: {
        marginTop: '16px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.08)',
        borderLeft: '3px solid var(--status-interim)',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }
    }, '⚠ Importing will replace all current data. Export your current data first if needed.'));

    content.appendChild(body);

    const footer = el('div', { class: 'modal-footer' },
      el('button', { class: 'btn' }, 'Cancel')
    );
    content.appendChild(footer);

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    Utils.$('.modal-close', content).addEventListener('click', closeModal);
    Utils.$$('.btn', footer)[0].addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }

  function handleFile(file, overlay) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;

      if (file.name.endsWith('.json')) {
        const success = Store.importJSON(text);
        if (success) {
          OC.Admin.showToast('Data imported successfully', 'success');
          overlay.remove();
          // Refresh all modules
          OC.TreeView.refresh();
          OC.ChartView.refresh();
          OC.PositionCard.refresh();
          OC.Header.init();
        } else {
          OC.Admin.showToast('Invalid JSON file', 'error');
        }
      } else {
        OC.Admin.showToast('Only JSON import is currently supported', 'error');
      }
    };
    reader.readAsText(file);
  }

  /* ── Helpers ────────────────────────────── */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function escapeCsv(str) {
    if (!str) return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  return { init };
})();
