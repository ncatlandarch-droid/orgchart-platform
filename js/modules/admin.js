/* ============================================
 * ORGCHART PLATFORM — Admin Module
 * ============================================ */

OC.Admin = (function() {
  const { Utils, Icons, Store, Events } = OC;
  const { el } = Utils;

  let adminBar;

  function render() {
    adminBar = Utils.$('.admin-bar');
    if (adminBar) return;

    adminBar = el('div', { class: 'admin-bar', id: 'admin-bar' },
      el('span', { class: 'admin-bar-text' },
        el('span', { class: 'admin-bar-dot' }),
        'Admin Mode Active'
      ),
      el('button', { class: 'admin-btn', id: 'admin-add-btn', innerHTML: Icons.plus(12) + ' Add Position' }),
      el('button', { class: 'admin-btn', id: 'admin-edit-btn', innerHTML: Icons.edit(12) + ' Edit Selected' }),
      el('button', { class: 'admin-btn', id: 'admin-delete-btn', innerHTML: Icons.trash(12) + ' Delete' }),
      el('button', { class: 'admin-btn primary', id: 'admin-save-btn', innerHTML: Icons.save(12) + ' Save Changes' })
    );

    document.body.appendChild(adminBar);

    // Events
    Utils.$('#admin-add-btn', adminBar).addEventListener('click', () => showAddModal());
    Utils.$('#admin-edit-btn', adminBar).addEventListener('click', () => showEditModal());
    Utils.$('#admin-delete-btn', adminBar).addEventListener('click', () => deleteSelected());
    Utils.$('#admin-save-btn', adminBar).addEventListener('click', () => {
      Store.saveToLocal();
      showToast('Changes saved successfully', 'success');
    });
  }

  function showAddModal() {
    const selected = Store.getSelected();
    if (!selected) {
      showToast('Select a position first', 'error');
      return;
    }

    const modal = createModal('Add New Position', (formData) => {
      const newNode = {
        id: Store.generateId(),
        title: formData.title || 'New Position',
        department: formData.department || selected.department,
        division: formData.division || selected.division,
        holder: { name: formData.holderName || '', since: '', photo: null },
        status: formData.status || 'vacant',
        level: (selected.level || 1) + 1,
        metadata: {
          qualifications: formData.qualifications ? formData.qualifications.split(',').map(s => s.trim()).filter(Boolean) : [],
          competencies: formData.competencies ? formData.competencies.split(',').map(s => s.trim()).filter(Boolean) : [],
          necessity: formData.necessity || '',
          salaryBand: formData.salaryBand || '',
          directReports: 0,
          teamSize: 0,
          classification: formData.classification || '',
          custom: {}
        },
        children: []
      };

      Store.addChild(selected.id, newNode);
      Store.select(newNode.id);
      showToast('Position added', 'success');
      refreshAll();
    });

    document.body.appendChild(modal);
  }

  function showEditModal() {
    const selected = Store.getSelected();
    if (!selected) {
      showToast('Select a position first', 'error');
      return;
    }

    const meta = selected.metadata || {};

    const modal = createModal('Edit Position', (formData) => {
      const updates = {
        title: formData.title || selected.title,
        department: formData.department || selected.department,
        division: formData.division || selected.division,
        holder: {
          name: formData.holderName || (selected.holder ? selected.holder.name : ''),
          since: formData.holderSince || (selected.holder ? selected.holder.since : ''),
          photo: null
        },
        status: formData.status || selected.status,
        metadata: {
          ...meta,
          qualifications: formData.qualifications ? formData.qualifications.split(',').map(s => s.trim()).filter(Boolean) : meta.qualifications,
          competencies: formData.competencies ? formData.competencies.split(',').map(s => s.trim()).filter(Boolean) : meta.competencies,
          necessity: formData.necessity !== undefined ? formData.necessity : meta.necessity,
          salaryBand: formData.salaryBand !== undefined ? formData.salaryBand : meta.salaryBand,
          classification: formData.classification !== undefined ? formData.classification : meta.classification
        }
      };

      Store.updateNode(selected.id, updates);
      showToast('Position updated', 'success');
      refreshAll();
    }, {
      title: selected.title,
      department: selected.department,
      division: selected.division,
      holderName: selected.holder ? selected.holder.name : '',
      holderSince: selected.holder ? selected.holder.since : '',
      status: selected.status,
      qualifications: meta.qualifications ? meta.qualifications.join(', ') : '',
      competencies: meta.competencies ? meta.competencies.join(', ') : '',
      necessity: meta.necessity || '',
      salaryBand: meta.salaryBand || '',
      classification: meta.classification || ''
    });

    document.body.appendChild(modal);
  }

  function deleteSelected() {
    const selected = Store.getSelected();
    if (!selected) return;
    if (!Store.getParent(selected.id)) {
      showToast('Cannot delete root position', 'error');
      return;
    }
    if (confirm(`Delete "${selected.title}"? This will also remove all positions under it.`)) {
      Store.removeNode(selected.id);
      showToast('Position deleted', 'success');
      refreshAll();
    }
  }

  function createModal(title, onSubmit, defaults = {}) {
    const overlay = el('div', { class: 'modal-overlay active' });

    const content = el('div', { class: 'modal-content' },
      el('div', { class: 'modal-header' },
        el('h3', { class: 'modal-title' }, title),
        el('button', { class: 'modal-close', innerHTML: Icons.x(16) })
      )
    );

    const body = el('div', { class: 'modal-body' });
    const form = el('div', { class: 'edit-form' });

    const fields = [
      { key: 'title', label: 'Position Title', type: 'text' },
      { key: 'holderName', label: 'Person Name', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['filled', 'vacant', 'interim'] },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'division', label: 'Division', type: 'text' },
      { key: 'salaryBand', label: 'Salary Band', type: 'text' },
      { key: 'classification', label: 'Classification', type: 'text' },
      { key: 'competencies', label: 'Competencies (comma-separated)', type: 'text' },
      { key: 'qualifications', label: 'Qualifications (comma-separated)', type: 'text' },
      { key: 'necessity', label: 'Role Necessity', type: 'textarea' }
    ];

    const inputs = {};

    fields.forEach(field => {
      const group = el('div', { class: 'form-group' },
        el('label', { class: 'form-label' }, field.label)
      );

      if (field.type === 'select') {
        const select = el('select', { class: 'form-select' });
        field.options.forEach(opt => {
          const option = el('option', { value: opt }, opt.charAt(0).toUpperCase() + opt.slice(1));
          if (defaults[field.key] === opt) option.selected = true;
          select.appendChild(option);
        });
        inputs[field.key] = select;
        group.appendChild(select);
      } else if (field.type === 'textarea') {
        const textarea = el('textarea', {
          class: 'form-textarea',
          value: defaults[field.key] || ''
        });
        textarea.textContent = defaults[field.key] || '';
        inputs[field.key] = textarea;
        group.appendChild(textarea);
      } else {
        const input = el('input', {
          class: 'form-input',
          type: 'text',
          value: defaults[field.key] || ''
        });
        inputs[field.key] = input;
        group.appendChild(input);
      }

      form.appendChild(group);
    });

    body.appendChild(form);
    content.appendChild(body);

    const footer = el('div', { class: 'modal-footer' },
      el('button', { class: 'btn' }, 'Cancel'),
      el('button', { class: 'btn btn-primary' }, 'Save')
    );
    content.appendChild(footer);

    overlay.appendChild(content);

    // Close handlers
    const closeModal = () => overlay.remove();
    Utils.$('.modal-close', content).addEventListener('click', closeModal);
    Utils.$$('.btn', footer)[0].addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    // Submit
    Utils.$$('.btn', footer)[1].addEventListener('click', () => {
      const formData = {};
      Object.entries(inputs).forEach(([key, inputEl]) => {
        formData[key] = inputEl.value || inputEl.textContent;
      });
      onSubmit(formData);
      closeModal();
    });

    return overlay;
  }

  function refreshAll() {
    OC.TreeView.refresh();
    OC.ChartView.refresh();
    OC.PositionCard.refresh();
    OC.Header.init();
  }

  function showToast(message, type = 'info') {
    let toastContainer = Utils.$('.toast-container');
    if (!toastContainer) {
      toastContainer = el('div', { class: 'toast-container' });
      document.body.appendChild(toastContainer);
    }

    const toast = el('div', { class: 'toast ' + type }, message);
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  return {
    init() {
      render();

      Events.on('store:adminMode', (on) => {
        if (adminBar) {
          adminBar.classList.toggle('active', on);
        }
      });
    },
    showToast
  };
})();
